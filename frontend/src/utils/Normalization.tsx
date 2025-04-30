export const fixEncoding = (str: string) => {
    return str
        .replace(/Do�a/g, 'Doña')
        .replace(/Dona/g, 'Doña');
};