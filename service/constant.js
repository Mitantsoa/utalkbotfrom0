
let editUrl = ""
let createdUrl = ""

function setConstant(req){
    editUrl = req.editUrl;
    createdUrl = req.createdUrl;
}

module.exports = {editUrl,createdUrl,setConstant}