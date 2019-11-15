import { User } from '../models';
import { Response } from 'express';
export const achievementsService = async (id: any, myWorldRecord: any, friendRecords: any, myFriendRecord: any, res: Response): Promise<any> => {

    const { totalRecord, position: myWorldRecordPosition } = myWorldRecord;
    const { records, weekStatistics } = await User.findById(id).populate([{ path: 'records', select: '-_id -__v -user -email' }, 'weekStatistics']).lean();

    const achievements: any = {
        fastHand: false,
        goodMemory: false,
        attentiveness: false,
        bronze: false,
        silver: false,
        gold: false,
        firstAmongFriends: false,
        topHundred: false,
        curiosity: false,
        fiveDaysRow: false,
        tenDaysRow: false,
        friendly: false
    };

    if (records.shulteTable >= 16000) { achievements.fastHand = true; }
    if (records.rememberNumber >= 1900 || records.rememberWords >= 1600 || records.memorySquare >= 14000) { achievements.goodMemory = true; }
    if (records.coloredWords >= 2200) { achievements.attentiveness = true; }

    let league: any, star: any;

    if (totalRecord >= 0) { league = 'bronze'; star = 1; }
    if (totalRecord >= 15000) { star = 2; }
    if (totalRecord >= 20000) { star = 3; }

    if (totalRecord >= 30000) { league = 'silver'; achievements.bronze = true; star = 1; }
    if (totalRecord >= 35000) { star = 2; }
    if (totalRecord >= 40000) { star = 3; }

    if (totalRecord >= 50000) { league = 'gold'; achievements.silver = true; star = 1; }
    if (totalRecord >= 55000) { star = 2; }
    if (totalRecord >= 60000) { star = 3; }

    if (totalRecord >= 70000) { achievements.gold = true; }

    // Other

    if (friendRecords.length >= 2) {
        if (myFriendRecord.position === 1) {
            achievements.firstAmongFriends = true;
        }

        achievements.friendly = true;
    }

    if (myWorldRecordPosition <= 100) {
        achievements.topHundred = true;
    }

    if (weekStatistics) {
        let dayCount = 0;

        weekStatistics.forEach(({ week }: any) => {
            week.forEach(({ hour, minut }: any) => {
                if (hour > 0 || minut > 0) { dayCount++; } else { dayCount = 0; }

                if (dayCount >= 5) { achievements.fiveDaysRow = true; }
                if (dayCount >= 10) { achievements.tenDaysRow = true; }
            });
        });
    }

    const isAllGamesPassed = Object.keys(records).every((item: any) => records[item] > 0);
    if (isAllGamesPassed) achievements.curiosity = true;

    const achievementsArr = Object.keys(achievements).map(item => ({
        name: item,
        translate: res.__(item),
        verity: achievements[item]
    }));

    return {
        achievements: achievementsArr,
        league,
        star,
    };
};
