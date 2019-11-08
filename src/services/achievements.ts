import { User } from '../models';

export const achievementsService = async (id: any, totalRecord: any): Promise<{ achievements: any; league: any; star: any }> => {

    const { records } = await User.findById(id).populate('records');

    let achievements: any = {
        fastHand: false,
        goodMemory: false,
        attentiveness: false,
        bronze: false,
        silver: false,
        gold: false,
        platinum: false
    };

    if (records.shulteTable >= 15000) { achievements.fastHand = true; }
    if (records.rememberNumber >= 1900 || records.rememberWords >= 1900 || records.memorySquare >= 5000) { achievements.goodMemory = true; }
    if (records.coloredWords >= 2000) { achievements.attentiveness = true; }

    let league: any, star: any;

    if (totalRecord >= 0) { league = 'bronze'; star = 1; }
    if (totalRecord >= 10000) { star = 2; }
    if (totalRecord >= 15000) { star = 3; }

    if (totalRecord >= 20000) { league = 'silver'; achievements.bronze = true; star = 1; }
    if (totalRecord >= 25000) { star = 2; }
    if (totalRecord >= 30000) { star = 3; }

    if (totalRecord >= 40000) { league = 'gold'; achievements.silver = true; star = 1; }
    if (totalRecord >= 45000) { star = 2; }
    if (totalRecord >= 50000) { star = 3; }

    if (totalRecord >= 60000) { league = 'platinum'; achievements.gold = true; star = 1; }
    if (totalRecord >= 65000) { star = 2; }
    if (totalRecord >= 70000) { star = 3; }

    if (totalRecord >= 80000) { achievements.platinum = true; }

    const achievementsArr = Object.keys(achievements).map(item => ({
        name: item,
        verity: achievements[item]
    }));

    return {
        achievements: achievementsArr,
        league,
        star
    };
};
