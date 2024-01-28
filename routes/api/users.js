const express = require('express');
const router = express.Router();
const userUsersController = require('../../controller/UserControllers/user-usersController');
const adminUserController = require('../../controller/UserControllers/admin-usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), userUsersController.getUser)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), userUsersController.updateUserAuthDetails)

router.route('/admin')
    .get(verifyRoles(ROLES_LIST.Admin), adminUserController.getAllUsers)
    .put(verifyRoles(ROLES_LIST.Admin), adminUserController.updateUserAuthDetails)

router.route('/admin/:id')
    .get(verifyRoles(ROLES_LIST.Admin), adminUserController.getUser)
    .delete(verifyRoles(ROLES_LIST.Admin), adminUserController.deleteUser)

// router.route('/update')
//     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.updateUserRoles)

module.exports = router;