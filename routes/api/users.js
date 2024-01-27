const express = require('express');
const router = express.Router();
const usersController = require('../../controller/UserControllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.deleteUser)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User), usersController.updateUserAuthDetails)

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

// router.route('/update')
//     .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.updateUserRoles)

module.exports = router;