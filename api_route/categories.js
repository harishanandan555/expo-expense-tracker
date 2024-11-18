//Categories.js
const { Router } = require('express');
const { z } = require("zod");
// const { getCurrentUser } = require("./services/user.services"); // Adjust the path to your user service
// const { getCategories, getDefaultCategories } = require("../screen/services/firebaseSettings"
const router = Router();

router.get("/fetchcategories", async (req, res) => {
    
  try {
    
    // const { db } = await import('../screen/services/firebaseSetting.js');
    // console.log(db)

    // const user = await firebase.getCurrentUser();

    // if (!user) {
    //   return res.redirect("/auth/sign-in");
    // }

    const { type: paramType } = req.query;

    // Validate the query parameter
    const validator = z.enum(["income", "expense"]);
    const queryParams = validator.safeParse(paramType);

    if (!queryParams.success) {
      return res.status(400).json(queryParams.error);
    }

    const type = queryParams.data;

    // Get user-specific categories
    const userCategories = await getCategories(userId, type);
    const defaultCategories = await getDefaultCategories(type);

    // Combine both arrays of categories and add `isDefault` flag
    const combinedCategories = [
      ...defaultCategories.map((category) => ({
        ...category,
        isDefault: true,
      })),
      ...userCategories.map((category) => ({
        ...category,
        isDefault: false,
      })),
    ];

    return res.json(combinedCategories);
    
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "An error occurred while fetching categories." });
  }

});

module.exports = router;






// import { Router } from 'express';
// import { z } from 'zod';
// import { getCategories, getDefaultCategories } from '../screen/services/firebaseSettings';
// const router = Router();

// router.get("/fetchcategories", async (req, res) => {
//   try {
//     const { type: paramType } = req.query;

//     // Validate the query parameter
//     const validator = z.enum(["income", "expense"]);
//     const queryParams = validator.safeParse(paramType);

//     if (!queryParams.success) {
//       return res.status(400).json(queryParams.error);
//     }

//     const type = queryParams.data;

//     // Get user-specific categories
//     const userCategories = await getCategories(userId, type);
//     const defaultCategories = await getDefaultCategories(type);

//     // Combine both arrays of categories and add `isDefault` flag
//     const combinedCategories = [
//       ...defaultCategories.map((category) => ({
//         ...category,
//         isDefault: true,
//       })),
//       ...userCategories.map((category) => ({
//         ...category,
//         isDefault: false,
//       })),
//     ];

//     return res.json(combinedCategories);

//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return res.status(500).json({ error: "An error occurred while fetching categories." });
//   }
// });

// // Change this to export default to maintain ES module compatibility
// export default router;
