import mongoose from 'mongoose'

export function generateId(): string {
    return new mongoose.Types.ObjectId().toHexString()
  }