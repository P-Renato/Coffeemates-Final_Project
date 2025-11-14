import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import type { IUser } from "../libs/types";


const userSchema = new mongoose.Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
        },
        password: {
            type: String,
            required: [true, '❌ Password is required'],
            minlength: [6, '❌ Password must be at least 6 characters']
        },
        coffeeProfile: {
            basics: {
                favoriteType: String,
                neighborhood: String,
                favoriteCafe: String,
                coffeeTime: String,
                goToPastry: String
            },
            personality: {
                usualOrder: String,
                musicCombo: String,
                coffeeVibe: String,
                friendCafe: String,
                dateCafe: String,
                coffeeStylePerson: String
            },
            taste: {
                beanOrigin: String,
                roastPreference: String,
                brewingMethod: String,
                milkChoice: String,
                sugarSyrup: String
            },
            vibe: {
                coffeeMeaning: String,
                bestMemory: String,
                idealMate: String,
                dreamCafe: String,
                cafeToVisit: String
            }
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;