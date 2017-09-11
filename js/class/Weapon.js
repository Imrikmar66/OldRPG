function Weapon(weaponId){
	switch (weaponId){
		case 0:
			//Features
			this.weaponName = "Weak";
			this.strength = 3;
			break;
		case 1:
			//Features
			this.weaponName = "Medium";
			this.strength = 6;
			break;
		case 2:
			//Features
			this.weaponName = "Heavy";
			this.strength = 10;
			break;
	}
}