/**
 * User Model Tests
 * =================
 */

const User = require('../../src/models/User');

describe('User Model', () => {
  describe('User creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.isActive).toBe(true);
    });

    it('should fail if email is missing', async () => {
      const userData = {
        name: 'Test User',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail if password is too short', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12345', // Less than 6 characters
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'mySecurePassword123';
      const user = await User.create({
        name: 'Test User',
        email: 'hash-test@example.com',
        password: plainPassword,
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });

    it('should compare password correctly', async () => {
      const plainPassword = 'mySecurePassword123';
      const user = await User.create({
        name: 'Test User',
        email: 'compare-test@example.com',
        password: plainPassword,
      });

      // Retrieve user with password
      const userWithPassword = await User.findById(user._id).select('+password');
      
      const isMatch = await userWithPassword.comparePassword(plainPassword);
      expect(isMatch).toBe(true);

      const isWrong = await userWithPassword.comparePassword('wrongPassword');
      expect(isWrong).toBe(false);
    });
  });

  describe('Default values', () => {
    it('should set default daily targets', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'defaults@example.com',
        password: 'password123',
      });

      expect(user.dailyTargets.calories).toBe(2000);
      expect(user.dailyTargets.protein).toBe(50);
      expect(user.dailyTargets.carbs).toBe(250);
      expect(user.dailyTargets.fat).toBe(65);
    });

    it('should set default preferences', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'prefs@example.com',
        password: 'password123',
      });

      expect(user.preferences.dietType).toBe('none');
      expect(user.preferences.allergies).toHaveLength(0);
    });
  });

  describe('BMI calculation', () => {
    it('should calculate BMI correctly', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'bmi@example.com',
        password: 'password123',
        profile: {
          weight: 70,
          height: 175,
        },
      });

      const bmi = user.calculateBMI();
      expect(bmi).toBeCloseTo(22.9, 1);
    });

    it('should return null if weight or height is missing', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'bmi-null@example.com',
        password: 'password123',
      });

      const bmi = user.calculateBMI();
      expect(bmi).toBeNull();
    });
  });
});

