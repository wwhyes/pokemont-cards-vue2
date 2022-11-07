export const round = (num, fix = 3) => parseFloat(num.toFixed(fix))
export const clamp = (num, min = -20, max = 20) => Math.min(Math.max(num, min), max)
