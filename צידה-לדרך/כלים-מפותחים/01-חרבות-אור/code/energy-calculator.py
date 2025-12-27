#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
מחשבון אנרגיה - חרבות אור
=========================

תוכנה לחישוב צריכת אנרגיה ומצב הסוללה של חרבות האור
"""

class LightSword:
    """מחלקה המייצגת חרב אור"""
    
    def __init__(self, name="חרב אור"):
        self.name = name
        self.max_capacity = 10000  # יחידות אור
        self.current_energy = 10000  # מלא בהתחלה
        self.spiritual_battery = 5000  # סוללה רוחנית
        
        # קצבי צריכה (יחידות אור לדקה)
        self.consumption_rates = {
            'rest': 0,
            'standby': 5,
            'normal': 50,
            'intensive': 200,
            'ultimate': 500
        }
    
    def get_status(self):
        """מחזיר את מצב האנרגיה הנוכחי"""
        percentage = (self.current_energy / self.max_capacity) * 100
        
        if percentage > 80:
            status = "מצוין ✅"
        elif percentage > 50:
            status = "טוב 👍"
        elif percentage > 20:
            status = "נמוך ⚠️"
        elif percentage > 5:
            status = "קריטי 🚨"
        else:
            status = "ריק 🔴"
        
        return {
            'percentage': round(percentage, 2),
            'current': self.current_energy,
            'max': self.max_capacity,
            'status': status
        }
    
    def use_ability(self, ability_type, duration_minutes):
        """
        שימוש ביכולת מסוימת
        
        Args:
            ability_type: סוג השימוש ('rest', 'standby', 'normal', 'intensive', 'ultimate')
            duration_minutes: משך הזמן בדקות
        
        Returns:
            dict: מידע על השימוש
        """
        if ability_type not in self.consumption_rates:
            return {'error': 'סוג שימוש לא חוקי'}
        
        consumption = self.consumption_rates[ability_type] * duration_minutes
        
        if consumption > self.current_energy:
            # אין מספיק אנרגיה
            return {
                'success': False,
                'message': f'⚠️ אין מספיק אנרגיה! נדרש: {consumption}, יש: {self.current_energy}',
                'remaining': self.current_energy
            }
        
        # צרוך אנרגיה
        self.current_energy -= consumption
        
        return {
            'success': True,
            'consumed': consumption,
            'remaining': self.current_energy,
            'message': f'✅ השימוש הצליח. נצרכו {consumption} יחידות אור'
        }
    
    def charge(self, method='sun', duration_hours=1):
        """
        טעינת החרב
        
        Args:
            method: שיטת טעינה ('sun', 'prayer', 'divine')
            duration_hours: משך הטעינה בשעות
        """
        charge_rates = {
            'sun': 100,  # יחידות לשעה
            'prayer': 150,
            'divine': 500
        }
        
        if method not in charge_rates:
            return {'error': 'שיטת טעינה לא חוקית'}
        
        charge_amount = charge_rates[method] * duration_hours
        
        # לא ניתן לטעון מעל המקסימום
        if self.current_energy + charge_amount > self.max_capacity:
            charge_amount = self.max_capacity - self.current_energy
        
        self.current_energy += charge_amount
        
        return {
            'success': True,
            'charged': charge_amount,
            'current': self.current_energy,
            'message': f'⚡ נטענו {charge_amount} יחידות אור'
        }
    
    def calculate_remaining_time(self, ability_type):
        """מחשב כמה זמן נשאר לשימוש ביכולת מסוימת"""
        if ability_type not in self.consumption_rates:
            return None
        
        rate = self.consumption_rates[ability_type]
        
        if rate == 0:
            return float('inf')  # אינסוף במנוחה
        
        remaining_minutes = self.current_energy / rate
        hours = int(remaining_minutes // 60)
        minutes = int(remaining_minutes % 60)
        
        return {
            'total_minutes': round(remaining_minutes, 2),
            'hours': hours,
            'minutes': minutes,
            'formatted': f'{hours} שעות ו-{minutes} דקות'
        }


def print_status(sword):
    """מדפיס את מצב החרב בצורה יפה"""
    status = sword.get_status()
    
    print(f"\n{'='*50}")
    print(f"📊 מצב {sword.name}")
    print(f"{'='*50}")
    print(f"אחוז: {status['percentage']}%")
    print(f"אנרגיה נוכחית: {status['current']}/{status['max']}")
    print(f"סטטוס: {status['status']}")
    
    # בר ויזואלי
    bar_length = 30
    filled = int((status['percentage'] / 100) * bar_length)
    bar = '█' * filled + '░' * (bar_length - filled)
    print(f"[{bar}]")
    print(f"{'='*50}\n")


def main():
    """תוכנית ראשית - דוגמאות שימוש"""
    
    print("⚔️ מחשבון אנרגיה - חרבות אור ⚔️\n")
    
    # יצירת חרב
    my_sword = LightSword("חרבת האור שלי")
    
    # מצב התחלתי
    print_status(my_sword)
    
    # שימוש בסיסי למשך 10 דקות
    print("🔸 שימוש רגיל למשך 10 דקות...")
    result = my_sword.use_ability('normal', 10)
    print(result['message'])
    print_status(my_sword)
    
    # שימוש אינטנסיבי למשך 30 דקות
    print("🔸 שימוש אינטנסיבי למשך 30 דקות...")
    result = my_sword.use_ability('intensive', 30)
    print(result['message'])
    print_status(my_sword)
    
    # בדיקת זמן נותר
    print("⏱️ חישוב זמן שימוש נותר:\n")
    for ability in ['normal', 'intensive', 'ultimate']:
        time_left = my_sword.calculate_remaining_time(ability)
        print(f"{ability}: {time_left['formatted']}")
    
    # טעינה
    print("\n⚡ טעינה בשמש למשך 5 שעות...")
    result = my_sword.charge('sun', 5)
    print(result['message'])
    print_status(my_sword)


if __name__ == "__main__":
    main()

