/**
 * Initial migration — creates all collections, indexes, and schema validations
 * to match the Mongoose schemas defined in the NestJS codebase.
 *
 * Collections:
 *   1. users
 *   2. items
 *   3. roles
 *   4. permissions
 *   5. brands
 *   6. carts
 *   7. quizquestions
 *   8. skintyperesults
 *   9. userquizresponses
 */

module.exports = {
  async up(db) {
    // ──────────────────────────────────────────────
    // 1. PERMISSIONS
    // ──────────────────────────────────────────────
    await db.createCollection('permissions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          properties: {
            name: { bsonType: 'string' },
            apiPath: { bsonType: 'string' },
            method: { bsonType: 'string' },
            module: { bsonType: 'string' },
            isDeleted: { bsonType: 'bool' },
            deletedAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // ──────────────────────────────────────────────
    // 2. ROLES
    // ──────────────────────────────────────────────
    await db.createCollection('roles', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          properties: {
            name: { bsonType: 'string' },
            description: { bsonType: 'string' },
            permissions: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
            },
            isDeleted: { bsonType: 'bool' },
            deletedAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // ──────────────────────────────────────────────
    // 3. BRANDS
    // ──────────────────────────────────────────────
    await db.createCollection('brands', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          properties: {
            name: { bsonType: 'string' },
            description: { bsonType: 'string' },
            isDeleted: { bsonType: 'bool' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // ──────────────────────────────────────────────
    // 4. ITEMS
    // ──────────────────────────────────────────────
    await db.createCollection('items', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          properties: {
            name: { bsonType: 'string' },
            imageUrls: {
              bsonType: 'array',
              items: { bsonType: 'string' },
            },
            price: { bsonType: 'number' },
            flashSale: { bsonType: 'number' },
            description: { bsonType: 'string' },
            brand: { bsonType: 'objectId' },
            quantity: { bsonType: 'number' },
            stock: { bsonType: 'bool' },
            isDeleted: { bsonType: 'bool' },
            deletedAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // ──────────────────────────────────────────────
    // 5. USERS
    // ──────────────────────────────────────────────
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email'],
          properties: {
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            avatar: { bsonType: 'string' },
            name: { bsonType: 'string' },
            phone: { bsonType: 'string' },
            dateOfBirth: { bsonType: 'date' },
            gender: { bsonType: 'string' },
            roleId: { bsonType: 'objectId' },
            address: { bsonType: 'string' },
            skin: { bsonType: 'string' },
            carts: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
            },
            refreshToken: { bsonType: 'string' },
            isDeleted: { bsonType: 'bool' },
            deletedAt: { bsonType: 'date' },
            createdBy: { bsonType: 'object' },
            updatedBy: { bsonType: 'object' },
            favoriteItems: {
              bsonType: 'array',
              items: { bsonType: 'objectId' },
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // Unique index on email (matches @Prop({ required: true, unique: true }))
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // ──────────────────────────────────────────────
    // 6. CARTS
    // ──────────────────────────────────────────────
    await db.createCollection('carts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          properties: {
            userId: { bsonType: 'objectId' },
            items: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                properties: {
                  itemId: { bsonType: 'objectId' },
                  quantity: { bsonType: 'number' },
                  price: { bsonType: 'number' },
                },
              },
            },
            totalAmount: { bsonType: 'number' },
            status: { bsonType: 'string' },
            paymentMethod: { bsonType: 'string' },
            purchaseDate: { bsonType: 'date' },
            isOrderForOther: { bsonType: 'bool' },
            recipientInfo: {
              bsonType: 'object',
              properties: {
                name: { bsonType: 'string' },
                email: { bsonType: 'string' },
                address: { bsonType: 'string' },
                phone: { bsonType: 'string' },
                note: { bsonType: 'string' },
              },
            },
            isDeleted: { bsonType: 'bool' },
            deleteAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // Index for fast lookup by userId
    await db.collection('carts').createIndex({ userId: 1 });

    // ──────────────────────────────────────────────
    // 7. QUIZ QUESTIONS
    // ──────────────────────────────────────────────
    await db.createCollection('quizquestions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['questionId', 'questionText', 'isActive', 'options'],
          properties: {
            questionId: { bsonType: 'string' },
            questionText: { bsonType: 'string' },
            isActive: { bsonType: 'bool' },
            options: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                properties: {
                  text: { bsonType: 'string' },
                  points: { bsonType: 'number' },
                  skinType: { bsonType: 'string' },
                },
              },
            },
          },
        },
      },
    });

    // ──────────────────────────────────────────────
    // 8. SKIN TYPE RESULTS
    // ──────────────────────────────────────────────
    await db.createCollection('skintyperesults', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'skinType',
            'vietnameseSkinType',
            'description',
            'recommendations',
            'scoreThreshold',
          ],
          properties: {
            skinType: { bsonType: 'string' },
            vietnameseSkinType: { bsonType: 'string' },
            description: { bsonType: 'string' },
            recommendations: {
              bsonType: 'array',
              items: { bsonType: 'string' },
            },
            scoreThreshold: { bsonType: 'number' },
          },
        },
      },
    });

    // ──────────────────────────────────────────────
    // 9. USER QUIZ RESPONSES
    // ──────────────────────────────────────────────
    await db.createCollection('userquizresponses', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'userId',
            'answers',
            'scorePercentage',
            'determinedSkinType',
          ],
          properties: {
            userId: { bsonType: 'objectId' },
            answers: { bsonType: 'object' },
            scorePercentage: { bsonType: 'number' },
            determinedSkinType: { bsonType: 'string' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });

    // Index for fast lookup by userId
    await db.collection('userquizresponses').createIndex({ userId: 1 });

    console.log('✅ Initial migration applied — all collections created.');
  },

  async down(db) {
    // Drop in reverse dependency order
    const collections = [
      'userquizresponses',
      'skintyperesults',
      'quizquestions',
      'carts',
      'users',
      'items',
      'brands',
      'roles',
      'permissions',
    ];

    for (const name of collections) {
      const exists = await db
        .listCollections({ name })
        .toArray();
      if (exists.length) {
        await db.dropCollection(name);
      }
    }

    console.log('⬇️  Initial migration rolled back — all collections dropped.');
  },
};
