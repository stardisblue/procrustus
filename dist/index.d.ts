export default function procrustus(M1: number[][], M2: number[][], scaling?: boolean): {
    d: number;
    Z: any;
    tform: {
        rotation: number[][];
        scale: number;
        translation: number;
    };
};
