const router = require("express").Router();
const ocr = require('../lib/ocr-tesseract');
const fs = require('fs');

router.post('/parse-image', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "no files were uploaded." });
  }

  // The name of the input field is used to retrieve the uploaded file
  let imageFile = req.files.image;

  ocr
    .parseImage(imageFile.tempFilePath)
    .then(result => {
      console.log('parse-image result:', result);
      return res.status(200).json({ result });
    })
    .then(() => {
      fs.unlinkSync(imageFile.tempFilePath)
      console.log("deleted temporary file", imageFile.tempFilePath);
    })
    .catch(error => {
      console.log("[OCR] error:", error);
      return res.status(500).json({
        error: `unable to parse image ${error ? error.message : error}`
      });
    });
});

module.exports = router;
