import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import type { IUser } from "../libs/types";

// Define the schema fields with proper typing
const userSchemaFields: mongoose.SchemaDefinition<IUser> = {
    username: {
        type: String,
        required: function(this: IUser) {
            return this.oauthProvider === 'local';
        },
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
    place: {
        type: String,
        default: "Unkown Location",
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: { 
        type: String, 
        enum: ['active', 'pending', 'banned', 'inactive'],
        default: 'active' 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    password: {
        type: String,
        required: function(this: IUser) {
            return this.oauthProvider === 'local';
        },
        minlength: [6, '❌ Password must be at least 6 characters']
    },
    photoURL: {
        type: String,
        required: false,
        default: ""
    },
    coverImageURL: {
        type: String,
        required: false,
        default: ""
    },
    googleId: {
        type: String,
        sparse: true
    },
    facebookId: {
        type: String,
        sparse: true
    },
    oauthProvider: {
        type: String,
        enum: ['google', 'facebook', 'local'],
        default: 'local'
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
};

const userSchema = new mongoose.Schema<IUser>(userSchemaFields, { timestamps: true });

// Rest of the code remains the same...
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.oauthProvider !== 'local') {
        return next();
    }
    
    if (!this.password) {
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password || this.oauthProvider !== 'local') {
        return false;
    }
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;