import express from "express";
import Handlebars from "handlebars";
import pdf from "html-pdf";
import fs from "fs/promises";

const app = express();

app.use(express.static("public"));
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  res.render("test");
});

app.get("/generatepdf", async (req, res) => {
  try {
    // Read the content of index.hbs
    const data = await fs.readFile("./views/test.hbs", "utf8");

    // Compile the Handlebars template
    const template = Handlebars.compile(data);

    // Data to be injected into the template
    const dataObj = {
      title: "My Document",
      content: "Hello, world!",
    };

    // Render the template with the data
    const html = template(dataObj);

    // Options for PDF generation (optional)
    const options = {
      format: "A4",
    };

    // Generate PDF
    pdf.create(html, options).toStream((err, stream) => {
      if (err) {
        return res.status(500).send("Error generating PDF");
      }

      res.setHeader("Content-Disposition", 'attachment; filename="output.pdf"');
      res.setHeader("Content-Type", "application/pdf");
      stream.pipe(res);
    });
  } catch (error) {
    res.status(500).send("Error reading template file");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
