export const cleanUnnecessary = (arr) => {
    return arr.map(({ value, location, ...cleanedItem }: any) => {
        const { msg: { statusCode, message }, param } = cleanedItem;
        return {
            statusCode,
            message,
            param
        };
    });
};