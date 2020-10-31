// input InputCategory {
//     name: String!
//     description: String
//     enabled: Boolean
//     parentCategory: ID
//   }

//   type Query {
//     categories: [Category]
//     category(id: ID!): Category
//   }

//   type Mutation {
//     addCategory(category: InputCategory!): Category
//     updateCategory(id: ID!, category: InputCategory!): Category
//     deleteCategory(id: ID!): Int
//     addCategoryImage(id: ID!, image: Upload!): Category
//     deleteCategoryImage(id: ID!): Category
//   }

//   type Category {
//     id: ID
//     name: String!
//     description: String
//     pictureName: String
//     enabled: Boolean
//     parentCategory: ID
//     childCategories: [Category]
//     products: [Product]
//   }
