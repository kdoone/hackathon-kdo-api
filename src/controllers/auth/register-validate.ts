import { User } from '../../models';
import { check } from 'express-validator';
export const registerValidate = [
    check('email')
        .trim()
        .bail()
        .not().isEmpty().withMessage({ message: 'email is required' })
        .bail()
        .isEmail().withMessage({ message: 'it is not email' })
        .bail()
        .custom(async value => {
            const exists = await User.isEmailExists(value);
            if (exists) { return Promise.reject(); }
        }).withMessage({ message: 'email already in use' })
        .bail()
        .isLength({ max: 64 }).withMessage({ message: 'shall not exceed 32 characters' }),

    check('firstName')
        .trim()
        .not().isEmpty().withMessage({ message: 'firstName is required' }),
    check('lastName')
        .trim()
        .not().isEmpty().withMessage({ message: 'firstName is required' }),
    check('patronymic')
        .trim()
        .not().isEmpty().withMessage({ message: 'patronymic is required' }),
    check('uin')
        .trim()
        .not().isEmpty().withMessage({ message: 'uin is required' }),
    check('udCity')
        .trim()
        .not().isEmpty().withMessage({ message: 'udCity is required' }),
    check('udFromDate')
        .trim()
        .not().isEmpty().withMessage({ message: 'udFromDate is required' }),
    check('udToDate')
        .trim()
        .not().isEmpty().withMessage({ message: 'udToDate is required' }),
    check('liveCity')
        .trim()
        .not().isEmpty().withMessage({ message: 'liveCity is required' }),
    check('loanConditions')
        .trim()
        .not().isEmpty().withMessage({ message: 'loanConditions is required' }),
    check('phoneNumber')
        .trim()
        .not().isEmpty().withMessage({ message: 'phoneNumber is required' }),
    check('placeOfWork')
        .trim()
        .not().isEmpty().withMessage({ message: 'placeOfWork is required' }),
    check('category')
        .trim()
        .not().isEmpty().withMessage({ message: 'category is required' }),
    check('udNumber')
        .trim()
        .not().isEmpty().withMessage({ message: 'udNumber is required' }),
    check('position')
        .trim()
        .not().isEmpty().withMessage({ message: 'position is required' }),
    check('udByWhom')
        .trim()
        .not().isEmpty().withMessage({ message: 'udByWhom is required' }),
];