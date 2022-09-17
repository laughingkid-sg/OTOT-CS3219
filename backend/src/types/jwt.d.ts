type JwtDecoded = JwtPayload & {
    email: string;
    role: number[];
};

export { JwtDecoded };
