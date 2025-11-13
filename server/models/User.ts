import mongoose from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;

  coffeeProfile?: {
    basics?: {
      favoriteType?: string;
      neighborhood?: string;
      favoriteCafe?: string;
      coffeeTime?: string;
      goToPastry?: string;
    };
    personality?: {
      usualOrder?: string;
      musicCombo?: string;
      coffeeVibe?: string;
      friendCafe?: string;
      dateCafe?: string;
      coffeeStylePerson?: string;
    };
    taste?: {
      beanOrigin?: string;
      roastPreference?: string;
      brewingMethod?: string;
      milkChoice?: string;
      sugarSyrup?: string;
    };
    vibe?: {
      coffeeMeaning?: string;
      bestMemory?: string;
      idealMate?: string;
      dreamCafe?: string;
      cafeToVisit?: string;
    };
  };
}


const userSchema = new mongoose.Schema(
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
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;