import { Response, Request, NextFunction } from 'express';
import { User } from '../../models';
import { createTransport } from 'nodemailer';
import generator from 'generate-password';
import { isRequired } from '../../util/is-required';

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        if (!email) return isRequired('email', next);

        const isEmailExists = await User.isEmailExists(email);

        if (!isEmailExists) {
            return res.json({
                status: 0,
                message: 'Введенный email не существует'
            });
        }
        // 
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
                    length: 10,
                    numbers: true
                });
                // Создаю ссылки на экземлпяр чтобы не мутировать основной класс
                const user = new User();
                user.setPassword(password);

                await User.findOneAndUpdate({ email }, { hash: user.hash, salt: user.salt });

                await transporter.sendMail({
                    from: '"Boom Brains" <kazdevops@yandex.kz>',
                    to: `${email}, ${email}`,
                    subject: 'Password recovery',
                    html: `
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
            status: 1,
            message: 'Новый пароль отправлен на вашу почту'
        });

    }
    catch (err) {
        next(err);
    }
};