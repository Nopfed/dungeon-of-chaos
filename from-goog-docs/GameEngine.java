package rpcg;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class GameEngine {
	
static int numRolls;
static int numSides;
static int numMobs;
static int numLoots;
static int partySize;
static int num;

static BufferedReader in = new BufferedReader(new InputStreamReader(System.in));  //reads user input

/*
 * getModCard takes the size of the party as an integer and outputs two pseudo-random 
 * numbers based on the maximum party size; one number for monster spawns and one for 
 * loot rolls.
 * 																						*/
static void getModCard(int numParty){
	
	//level 1
	System.out.print("\nM x" + ((int) (Math.random() * numParty) + 3));
	System.out.println(" L x" + (((int) (Math.random() * numParty) + 1))/2 + "\n");

}

static void monsterRoll1( int mobs){
	
	int rollNum = 0, 
			count = 0, 
			basicCount = 0, 
			rareCount = 0;
		
		boolean bFlag = false, rFlag = false;
		
		while(count < mobs){
		
			rollNum = (int) ((Math.random()*8) + 1);
			//System.out.println(rollNum);
			
			if(rollNum == 1 || rollNum == 2 || rollNum == 3 || rollNum == 4 || rollNum == 5 || rollNum == 6){	//Basic mob. Chance is 6/8
				
				bFlag = true;
				basicCount++;
				
			}else if(rollNum == 7 || rollNum == 8){												//Rare mob. Chance is 2/8
				
				rFlag = true;
				rareCount++;
				
			}
			
			count++;
		}
		
		System.out.println("\n   Mobs\n----------");
		
		if(bFlag == true){
			
			System.out.println(basicCount + "x Basic Mob");
			
		}
		
		if(rFlag == true){
			
			System.out.println(rareCount + "x Rare Mob");
			
		}
		
		bFlag = false; rFlag = false;
		
		System.out.println("");
	
}

/*
 * lootRoll takes number from the user for how many times loot should be rolled for.
 * 																						*/
static void lootRoll(int loots){
	
	int rollNum = 0, 
		count = 0, 
		potionCount = 0, 
		basicCount = 0, 
		phoenixCount = 0, 
		rareCount = 0;
	
	boolean pFlag = false, phFlag = false, bFlag = false, rFlag = false;
	
	while(count < loots){
	
		rollNum = (int) ((Math.random()*12) + 1);
		//System.out.println(rollNum);
		
		if(rollNum == 6 || rollNum == 7 || rollNum == 8 || rollNum == 9){ 	//Potion. Chance is 4/12
			
			pFlag = true;
			potionCount++;
			
		}else if(rollNum == 3 || rollNum == 4 || rollNum == 5){				//Basic Loot. Chance is 3/12
			
			bFlag = true;
			basicCount++;
			
		}else if(rollNum == 2){												//Phoenix Up. Chance is 1/12
			
			phFlag = true;
			phoenixCount++;
			
		}else if(rollNum == 1){												//Rare Loot. Chance is 1/12
			
			rFlag = true;
			rareCount++;
			
		}
		
		count++;
	}
	
	System.out.println("\n   Loot\n----------");
	
	if(pFlag == true){
		
		System.out.println(potionCount + "x Potions");
		
	}
	
	if(phFlag == true){
		
		System.out.println(phoenixCount + "x Phoenix Up");
		
	}
	
	if(bFlag == true){
		
		System.out.println(basicCount + "x Basic");
		
	}
	
	if(rFlag == true){
		
		System.out.println(rareCount + "x Rare");
		
	}
	
	if(pFlag == false && phFlag == false && bFlag == false && rFlag == false){
		
		System.out.println("Nothing dropped.");
		
	}

	pFlag = false; phFlag = false; bFlag = false; rFlag = false;
	
	System.out.println("");
}

public static void main(String[] args) throws IOException {
	
	String option = "0";  //value is 0 because i made the conditionals below parse strings for integers since input comes in as a String
	
	System.out.println("How many players?"); // number of players is important for a lot of variables that will probably be based on the size of the party
	
	partySize = Integer.parseInt(in.readLine());
	
	while(Integer.parseInt(option) != 5){
			
		System.out.println("Choose an option:\n\n"
				+ "\t(1)Dice Roll\n"
				+ "\t(2)Modifier Card\n"
				+ "\t(3)Loot Roll\n"
				+ "\t(4)Monster Roll\n"
				+ "\t(5)Quit\n");
		
		option = in.readLine();
		
		if(Integer.parseInt(option) == 1){									//dice roll
			
			System.out.println("How many dice?");			
			
			numRolls =  Integer.parseInt(in.readLine());	//how many dice are to be rolled

			System.out.println("How many sides?");
		
			numSides = Integer.parseInt(in.readLine());		//number of sides for each roll
			num = 0;
			
			if(numRolls == 1){
				System.out.println("Rolling "+numRolls+" "+numSides+"-sided die:\n");
			}else if(numRolls > 1){
				System.out.println("Rolling "+numRolls+" "+numSides+"-sided dice:\n");
			}
			
			while(num != numRolls){				//roll the dice
				
				System.out.println((int) (Math.random() * numSides) + 1);
				
				num++;
			}
			
			System.out.println("");
			
		}else if(Integer.parseInt(option) == 2){							//modifier card
				
			getModCard(partySize);
		
		}else if(Integer.parseInt(option) == 3){							//loot
			
			System.out.println("How many Loot Rolls?");
			
			numLoots = Integer.parseInt(in.readLine());
			lootRoll(numLoots);
			
		}else if(Integer.parseInt(option) == 4){
			
			System.out.println("How many monsters?");
			
			numMobs = Integer.parseInt(in.readLine());
			monsterRoll1(numMobs);
			
		}else if(Integer.parseInt(option) != 5){
		
			System.out.println("Please enter valid option.");
		}
		
	}
	
	System.out.println("Terminated");
	
}

}
