package com.example.springapp.services;

import com.example.springapp.model.Pet;
import com.example.springapp.model.Shelter;
import com.example.springapp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private ShelterService shelterService;

    @Autowired
    private PetService petService;
    
    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 DataInitializationService starting...");
        int shelterCount = shelterService.getAllShelters().size();
        int petCount = petService.getAllPets().size();
        System.out.println("📊 Current shelter count: " + shelterCount);
        System.out.println("🐾 Current pet count: " + petCount);
        
        // Initialize shelters if none exist
        if (shelterCount == 0) {
            System.out.println("🏗️ Initializing shelters...");
            initializeShelters();
        } else {
            System.out.println("ℹ️ Database already has " + shelterCount + " shelters.");
        }
        
        // Initialize admin user for login
        System.out.println("👤 Initializing admin user...");
        initializeAdminUser();
        
        // Initialize regular user for login
        System.out.println("👤 Initializing regular user...");
        initializeRegularUser();
        
        // Initialize shelter users for login
        System.out.println("👤 Initializing shelter users...");
        initializeShelterUsers();
        
        // Initialize pets only if none exist
        if (petCount == 0) {
            System.out.println("🐾 Initializing pets...");
            initializePets();
            System.out.println("✅ Pet initialization completed!");
        } else {
            System.out.println("ℹ️ Database already has " + petCount + " pets. Skipping pet initialization.");
        }
    }

    private void initializeShelters() {
        // Create the three shelters from our frontend data
        Shelter shelter1 = new Shelter();
        shelter1.setShelterName("Happy Paws Shelter");
        shelter1.setEmail("info@happypaws.com");
        shelter1.setPhone("+91-9876543210");
        shelter1.setAddress("123 Pet Care Street, Mumbai, Maharashtra, India");
        shelterService.saveShelter(shelter1);

        Shelter shelter2 = new Shelter();
        shelter2.setShelterName("Second Chance Rescue");
        shelter2.setEmail("rescue@secondchance.org");
        shelter2.setPhone("+91-8765432109");
        shelter2.setAddress("456 Rescue Lane, Bangalore, Karnataka, India");
        shelterService.saveShelter(shelter2);

        Shelter shelter3 = new Shelter();
        shelter3.setShelterName("Paws and Hearts");
        shelter3.setEmail("contact@pawsandhearts.in");
        shelter3.setPhone("+91-7654321098");
        shelter3.setAddress("789 Animal Love Road, Mysore, Karnataka, India");
        shelterService.saveShelter(shelter3);
    }
    
    private void initializeAdminUser() {
        // Check if admin user already exists
        User existingAdmin = userService.findByEmail("admin@example.com");
        if (existingAdmin != null) {
            System.out.println("ℹ️ Admin user already exists: admin@example.com");
            return;
        }
        
        // Create admin user
        User adminUser = new User();
        adminUser.setEmail("admin@example.com");
        adminUser.setPassword("admin123"); // In production, this should be hashed
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setRole("Admin");
        adminUser.setPhone("+91-0000000000");
        adminUser.setAddress("Admin Office");
        adminUser.setCity("Mumbai");
        adminUser.setState("Maharashtra");
        adminUser.setZipCode("400001");
        adminUser.setIsActive(true);
        
        userService.saveUser(adminUser);
        System.out.println("✅ Created admin user: admin@example.com with password: admin123");
    }
    
    private void initializeRegularUser() {
        // Check if regular user already exists
        User existingUser = userService.findByEmail("user@example.com");
        if (existingUser != null) {
            System.out.println("ℹ️ Regular user already exists: user@example.com");
            return;
        }
        
        // Create regular user
        User regularUser = new User();
        regularUser.setEmail("user@example.com");
        regularUser.setPassword("password"); // In production, this should be hashed
        regularUser.setFirstName("John");
        regularUser.setLastName("Doe");
        regularUser.setRole("User");
        regularUser.setPhone("+91-1234567890");
        regularUser.setAddress("123 Main St");
        regularUser.setCity("Mumbai");
        regularUser.setState("Maharashtra");
        regularUser.setZipCode("400001");
        regularUser.setIsActive(true);
        
        userService.saveUser(regularUser);
        System.out.println("✅ Created regular user: user@example.com with password: password");
    }
    
    private void initializeShelterUsers() {
        // Create user accounts for each shelter
        createShelterUser("Happy Paws Shelter", "happypaws@admin.com", "happypaws123", "Happy", "Paws");
        createShelterUser("Second Chance Rescue", "secondchance@admin.com", "secondchance123", "Second", "Chance");
        createShelterUser("Paws and Hearts", "pawsandhearts@admin.com", "pawsandhearts123", "Paws", "Hearts");
    }
    
    private void createShelterUser(String shelterName, String email, String password, String firstName, String lastName) {
        User shelterUser = new User();
        shelterUser.setEmail(email);
        shelterUser.setPassword(password); // In production, this should be hashed
        shelterUser.setFirstName(firstName);
        shelterUser.setLastName(lastName);
        shelterUser.setRole("Shelter");
        shelterUser.setPhone("+91-0000000000");
        shelterUser.setAddress("Shelter Address");
        shelterUser.setCity("City");
        shelterUser.setState("State");
        shelterUser.setZipCode("000000");
        shelterUser.setIsActive(true);
        
        userService.saveUser(shelterUser);
        System.out.println("✅ Created shelter user: " + email + " with password: " + password);
    }

        private void initializePets() {
        System.out.println("🐾 Starting pet initialization...");
        // Get the shelters we just created
        var shelters = shelterService.getAllShelters();
        System.out.println("🏠 Found " + shelters.size() + " shelters");
        
        Shelter happyPaws = shelters.stream().filter(s -> s.getShelterName().equals("Happy Paws Shelter")).findFirst().orElse(null);
        Shelter secondChance = shelters.stream().filter(s -> s.getShelterName().equals("Second Chance Rescue")).findFirst().orElse(null);
        Shelter pawsAndHearts = shelters.stream().filter(s -> s.getShelterName().equals("Paws and Hearts")).findFirst().orElse(null);
        
        System.out.println("🏠 Happy Paws Shelter ID: " + (happyPaws != null ? happyPaws.getId() : "NOT FOUND"));
        System.out.println("🏠 Second Chance Rescue ID: " + (secondChance != null ? secondChance.getId() : "NOT FOUND"));
        System.out.println("🏠 Paws and Hearts ID: " + (pawsAndHearts != null ? pawsAndHearts.getId() : "NOT FOUND"));
        
        // Create exactly 33 pets to match frontend mockPets array
        System.out.println("📸 Creating 33 pets to match frontend data...");

        // Create 33 pets matching the frontend mockPets array
        // Dogs (20 pets)
        createPet("Buddy", "German Shepherd", "2 years", "dog", "Male", "Black and Brown", 
                 "A friendly and energetic dog who loves to play fetch and go for walks.", 
                 "assets/pets/Dog_German-Shepherd.webp", happyPaws, "Available", "Mumbai, India", true);
        createPet("Luna", "Beagle", "1 year", "dog", "Female", "Black", 
                 "A sweet and gentle dog who is great with children and other pets.", 
                 "assets/pets/Dog_beagle.jpg", happyPaws, "Available", "Mumbai, India", true);
        createPet("Max & Rax", "Indie dog", "1 year", "dog", "Male", "Brown and White", 
                 "A curious and intelligent dog who loves to explore and sniff around.", 
                 "assets/pets/Dog_indie_Nibri_and_jhibri.jpg", secondChance, "Available", "Bengalore, India", true);
        createPet("Bella", "Poodle Mix", "3 years", "dog", "Female", "White", 
                 "A gentle and calm dog who is perfect for apartment living.", 
                 "assets/pets/dog_poodle.jpg", secondChance, "Adopted", "Bengalore, India", true);
        createPet("Rocky", "Indie", "2 years", "dog", "Male", "Brown", 
                 "A loyal and protective dog who would make a great family guardian.", 
                 "assets/pets/Dog_Indie.jpg", pawsAndHearts, "Available", "Mysore, India", true);
        createPet("Mia", "Maltese", "2 years", "dog", "Female", "White", 
                 "A playful and affectionate small dog who loves cuddles.", 
                 "assets/pets/Dog_maltese.jpg", pawsAndHearts, "Available", "Mysore, India", true);
        createPet("Charlie", "Labrodor", "3 years", "dog", "Male", "Brown", 
                 "A street-smart and resilient dog with a big heart.", 
                 "assets/pets/Dog_labrodor.jpg", happyPaws, "Available", "Mysore, India", true);
        createPet("Shakti, Moti, Sheru", "Mixed Breed", "6 months", "dog", "Female", "White and Brown", 
                 "A playful puppy who loves to run and play.", 
                 "assets/pets/Dog_3pair-puppy.jpg", secondChance, "Available", "Bengalore, india", false);
        createPet("Rex", "Indie Dog", "4 years", "dog", "Male", "Brown", 
                 "A loyal and friendly street dog looking for a loving home.", 
                 "assets/pets/Dog_indie2.jpg", happyPaws, "Available", "Mumbai, India", true);
        createPet("Daku", "Indie Dog", "1 year 8 months", "dog", "Male", "Black and White", 
                 "A sweet and gentle dog who loves attention and treats.", 
                 "assets/pets/Dog_Indie5.jpg", secondChance, "Available", "Bengalore, India", true);
        createPet("Shabu", "Indie Dog", "8 months", "dog", "Male", "Brown", 
                 "A strong and protective dog who would make a great family companion.", 
                 "assets/pets/shabu.jpg", pawsAndHearts, "Available", "Mysore, India", true);
        createPet("Maltese Princess", "Maltese", "10 months", "dog", "Female", "White", 
                 "A beautiful and elegant small dog who loves to be pampered.", 
                 "assets/pets/Dog_maltese2.jpeg", happyPaws, "Available", "Mumbai, India", true);
        createPet("Andu and Pandu", "Indie Dog", "1 year", "dog", "Male", "Brown and Black", 
                 "A wise and experienced dog who has overcome many challenges.", 
                 "assets/pets/Dog_indie6.webp", secondChance, "Available", "Bangalore, India", true);
        createPet("Indie Warrior", "Indie Dog", "3 years", "dog", "Male", "Brown and Black", 
                 "A strong and resilient street dog who has overcome many challenges and is ready for a loving home.", 
                 "assets/pets/Dog_indie3.jpg", happyPaws, "Available", "Mumbai, India", true);
        createPet("Indie Princess", "Indie Dog", "2 years", "dog", "Female", "Black and White", 
                 "A gentle and loving indie dog who would make a perfect family companion.", 
                 "assets/pets/Dog_indie7.jpg", secondChance, "Available", "Bangalore, India", true);
        createPet("Pawsome", "Mixed Breed", "2 years", "dog", "Male", "Brown", 
                 "A pawsome dog with a big heart and lots of love to give.", 
                 "assets/pets/p1.jpg", pawsAndHearts, "Available", "Mysore, India", true);
        createPet("Furry", "Mixed Breed", "1 year", "dog", "Female", "White and Brown", 
                 "A furry little bundle of joy ready to bring happiness to your home.", 
                 "assets/pets/p2.jpg", happyPaws, "Available", "Mumbai, India", true);
        createPet("Lucky", "Mixed Breed", "3 years", "dog", "Male", "Black and White", 
                 "A lucky dog who found his way to safety and is now looking for his forever family.", 
                 "assets/pets/P3.jpg", secondChance, "Available", "Bangalore, India", true);
        createPet("Hope", "Mixed Breed", "2 years", "dog", "Female", "Brown", 
                 "A hopeful dog who believes in second chances and new beginnings.", 
                 "assets/pets/P4.jpg", pawsAndHearts, "Available", "Mysore, India", true);
        createPet("Joy", "Mixed Breed", "1 year", "dog", "Male", "White", 
                 "A joyful little dog who brings happiness wherever he goes.", 
                 "assets/pets/p5.jpg", happyPaws, "Available", "Mumbai, India", true);

        // Cats (8 pets)
        createPet("Beauty", "Maine Coon", "2 years", "cat", "Female", "Black and White", 
                 "A majestic and friendly cat who loves attention and playtime.", 
                 "assets/pets/Cat_Maine-Coon.jpeg", happyPaws, "Available", "Mumbai, India", true);
        createPet("Shadow", "Domestic Shorthair", "4 years", "cat", "Male", "Black", 
                 "A large and friendly cat who loves attention and playtime.", 
                 "assets/pets/cat_maine-coon.jpg", secondChance, "Available", "Bangalore, India", true);
        createPet("Fluffy", "Persian", "3 years", "cat", "Female", "White and Gray", 
                 "A beautiful and elegant cat who loves to be pampered.", 
                 "assets/pets/Cat_normal.jfif", happyPaws, "Available", "Mumbai, India", true);
        createPet("Mittens", "Domestic Shorthair", "2 years", "cat", "Female", "Black and White", 
                 "A playful and curious cat who loves to explore and play.", 
                 "assets/pets/Cat_normal2.jpg", secondChance, "Available", "Bangalore, India", true);
        createPet("Tiger", "Domestic Shorthair", "1 year", "cat", "Male", "Orange and White", 
                 "A young and energetic cat who loves to play and climb.", 
                 "assets/pets/Cat_normal3.jfif", pawsAndHearts, "Available", "Mysore, India", true);
        createPet("Princess", "Persian", "1 year", "cat", "Female", "White", 
                 "A regal and elegant cat who loves to be the center of attention.", 
                 "assets/pets/Cat_parsian.jpg", happyPaws, "Available", "Mumbai, India", true);
        createPet("Phili and Lili", "Domestic Shorthair", "1 year", "cat", "Female", "Gray and White", 
                 "A bonded pair of cats who must be adopted together.", 
                 "assets/pets/Cat_twins.jpg", secondChance, "Available", "Bangalore, India", true);
        createPet("Snowball", "Domestic Shorthair", "1 year", "cat", "Female", "White", 
                 "A gentle and calm white cat who loves to cuddle.", 
                 "assets/pets/Cat_white.jfif", pawsAndHearts, "Available", "Mysore, India", true);

        // Other Pets (11 pets)
        createPet("Polly", "African Grey Parrot", "5 years", "other", "Female", "Gray", 
                 "An intelligent and talkative parrot who loves to interact with people.", 
                 "assets/pets/Other_grey-parrot.jpg", happyPaws, "Available", "Mumbai, India", false);
        createPet("Nibi and Sibbi", "Syrian Hamster", "1 year", "other", "Male", "Brown and White", 
                 "A cute and active hamster who loves to run on his wheel.", 
                 "assets/pets/Other_hamster.jfif", secondChance, "Available", "Bengalore, India", false);
        createPet("Talkky", "Syrian Hamster", "1 year", "other", "Female", "Golden", 
                 "A sweet and gentle hamster who loves to be held gently.", 
                 "assets/pets/Other_Hamster2.jfif", pawsAndHearts, "Available", "Mysore, India", false);
        createPet("Cocoa", "Syrian Hamster", "2 years", "other", "Male", "Brown", 
                 "A friendly and curious hamster who loves to explore.", 
                 "assets/pets/Other_Hamster3.jpg", happyPaws, "Available", "Mumbai, India", false);
        createPet("Rainbow", "Budgerigar", "2 years", "other", "Male", "Green and Yellow", 
                 "A colorful and cheerful bird who loves to sing and play.", 
                 "assets/pets/Other_parot2.jfif", secondChance, "Available", "Bengalore, India", false);
        createPet("Sunny", "Cockatiel", "3 years", "other", "Female", "Yellow and Gray", 
                 "A beautiful and social bird who loves to whistle and dance.", 
                 "assets/pets/Other_Cockatiel.jpg", pawsAndHearts, "Available", "Mysore, India", false);
        createPet("Rick", "Holland Lop Rabbit", "2 years", "other", "Male", "Brown", 
                 "A soft and gentle rabbit who loves to hop around and eat vegetables.", 
                 "assets/pets/Other_rabbit-brown.jfif", happyPaws, "Available", "Mumbai, India", false);
        createPet("Snowflake", "Lionhead Rabbit", "1 year", "other", "Female", "White", 
                 "A fluffy and adorable rabbit with a distinctive mane.", 
                 "assets/pets/Other_rabit.jpeg", secondChance, "Available", "Bengalore, India", false);
        createPet("Cinnamon", "Rex Rabbit", "3 years", "other", "Male", "Brown", 
                 "A soft and velvety rabbit with a calm and friendly personality.", 
                 "assets/pets/Other_rabit2.jpeg", pawsAndHearts, "Available", "Mysore, India", false);
    }

    private void createPet(String name, String breed, String age, String petType, String gender, 
                          String color, String description, String imageUrl, Shelter shelter, String status, 
                          String location, Boolean vaccinated) {
        if (shelter == null) {
            System.out.println("❌ Cannot create pet " + name + " - shelter is null!");
            return;
        }
        
        // Check if pet with same name already exists
        List<Pet> existingPets = petService.getAllPets();
        boolean petExists = existingPets.stream()
            .anyMatch(p -> p.getName().equals(name) && p.getBreed().equals(breed));
        
        if (petExists) {
            System.out.println("⚠️ Pet " + name + " already exists. Skipping creation.");
            return;
        }
        
        Pet pet = new Pet();
        pet.setName(name);
        pet.setBreed(breed);
        pet.setAge(age);
        pet.setPetType(petType);
        pet.setGender(gender);
        pet.setColor(color);
        pet.setDescription(description);
        pet.setImageUrl(imageUrl);
        pet.setShelter(shelter);
        pet.setStatus(status);
        pet.setLocation(location);
        pet.setVaccinated(vaccinated);
        
        Pet savedPet = petService.savePet(pet);
        System.out.println("✅ Created pet: " + name + " (ID: " + savedPet.getId() + ") in " + shelter.getShelterName());
    }
}
