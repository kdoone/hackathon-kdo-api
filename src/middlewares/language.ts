import { Response, NextFunction } from 'express';
import i18n from 'i18n';

export const setLanguage = (req: any, res: Response, next: NextFunction) => {

    if (req.get('App-Language')) {
        if (req.get('App-Language') === 'kk') {
            i18n.setLocale(req, 'kz');
        } else {
            i18n.setLocale(req, req.get('App-Language'));
        }

        return next();
    }

    i18n.setLocale(req, 'en');
    next();
};