function GameClass(classId){
	switch (classId){
		case 1:
			//Features
			this.classId = 0;
			this.className = "Paladin";
			this.strength = 5;
			this.strengthLevelFactor = 1.2;
			this.toughness = 10;
			this.thougnessLevelFactor = 1.8;
			this.maxLife = 200;
			this.maxLifeLevelFactor = 1.8;
			this.maxMana = 100;
			this.maxManaLevelFactor = 1.2;
			this.speed = 30;
	
			//Stuff
			this.baseWeapon = new Weapon(0);
			this.baseArmor = new Armor(2);
			break;
		case 2:
			//Features
			this.classId = 1;
			this.className = "Wizard";
			this.strength = 10;
			this.strengthLevelFactor = 1.8;
			this.toughness = 5;
			this.thougnessLevelFactor = 1.2;
			this.maxLife = 200;
			this.maxLifeLevelFactor = 1.2;
			this.maxMana = 100;
			this.maxManaLevelFactor = 1.8;
			this.speed = 30;
	
			//Stuff
			this.baseWeapon = new Weapon(2);
			this.baseArmor = new Armor(0);
			break;
		default:
			//Features
			this.classId = 2;
			this.className = "Adventurer";
			this.strength = 7;
			this.strengthLevelFactor = 1.5;
			this.toughness = 7;
			this.thougnessLevelFactor = 1.5;
			this.maxLife = 150;
			this.maxLifeLevelFactor = 1.5;
			this.maxMana = 150;
			this.maxManaLevelFactor = 1.5;
			this.speed = 30;
	
			//Stuff
			this.baseWeapon = new Weapon(1);
			this.baseArmor = new Armor(1);
			break;
		}
}