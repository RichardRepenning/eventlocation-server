

export default function randomId(): string {
    let id: string = Math.floor(Math.random() * 1000).toString();
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomChar = function (): string {
        return characters[Math.floor(Math.random() * characters.length)];
    };
    id = randomChar() + id + randomChar();
    return id;
};