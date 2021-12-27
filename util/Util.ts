export const sum = (acc: number, it: number) => acc + it;
export const greatest = (acc: number, it: number) => it > acc ? it : acc;
export const flatten = <A>(acc: A[], it: A[]) => {
    acc.push(...it);
    return acc;
};
export const product = (acc: number, it: number) => acc * it;
export const largestToSmallest = (num1: number, num2: number) => num2 - num1;