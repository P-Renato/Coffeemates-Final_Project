import type { ErrorType } from './types'

export function createError(status: number, message: string): ErrorType {
     return { status, message };
}