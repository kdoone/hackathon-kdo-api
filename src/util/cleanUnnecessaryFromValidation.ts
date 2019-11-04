export const cleanUnnecessary = (arr: any) => {
    return arr.map(({ value, location, ...cleanedItem }: any) => {
        const { msg: { statusCode, message, ru }, param } = cleanedItem;
        return {
            statusCode,
            message,
            ru,
            param
        };
    });
};