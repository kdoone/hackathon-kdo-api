import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { createTransport } from 'nodemailer';
import generator from 'generate-password';
import { check, validationResult } from 'express-validator';
import { cleanUnnecessary } from '../../util';

export const resetPaswordValidate = [
    check('email')
        .trim()
        .exists().withMessage({ statusCode: 1, message: 'email is required' })
        .bail()
        .not().isEmpty().withMessage({ statusCode: 2, message: 'email is empty' })
        .bail()
        .isEmail().withMessage({ statusCode: 3, message: 'it is not email' })
        .bail()
        .custom(async value => {
            const exists = await User.isEmailExists(value);
            if (!exists) { return Promise.reject(); }
        }).withMessage({ statusCode: 4, message: 'email doesnt exists' })
        .bail()
        .isLength({ max: 64 }).withMessage({ statusCode: 5, message: 'shall not exceed 32 characters' }),
];

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            let cleaned = cleanUnnecessary(errors.array());
            cleaned = cleaned.map((item: any) => ({ ...item, message: res.__(item.message) }));

            return res.status(200).json({ status: 'rejected', errors: cleaned });
        }

        const transporter = createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'kazdevops@yandex.kz',
                pass: 'Mur29Alm05!('
            }
        });

        const createNewPassword = async () => {
            try {
                // Рандомлю пароль
                const password = generator.generate({
                    length: 5,
                    numbers: true,
                    uppercase: false
                });
                // Создаю ссылки на экземлпяр чтобы не мутировать основной класс
                const user = new User();
                user.setPassword(password);

                await User.findOneAndUpdate({ email }, { hash: user.hash, salt: user.salt, token: 'deleted' });

                await transporter.sendMail({
                    from: '"Boom Brains" <kazdevops@yandex.kz>',
                    to: `${email}, ${email}`,
                    subject: 'Password recovery',
                    html: `
                        <p> Your new password </p>
                        <p> Email: ${email} </p>
                        <p> New password: ${password} </p>
                    `
                });
            }
            catch (err) {
                next(err);
            }
        };

        await createNewPassword();

        res.json({
            status: 'accepted',
            message: 'Новый пароль отправлен на вашу почту'
        });

    }
    catch (err) {
        next(err);
    }
};