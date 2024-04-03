import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());

const resumeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  address: String,
  phoneNo: String,
  dob: String,
  isActive: Boolean,
  nationality: String,
  employeeStatus: String,
  isAgreedToTermsAndConditions: Boolean,
  preferedLanguages: [String],
  workExpirenece: [
    {
      workingPlaceName: String,
      workingPlaceAddress: String,
      numberOfExpirence: Number,
      typeOfPeriod: String,
    },
  ],
});

// Create a model based on the schema
const Resume = mongoose.model('Resume', resumeSchema);

mongoose.connect("mongodb://localhost:27017/resume", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.post('/save-resume', async (req, res) => {
  const resumeData = req.body;

  try {
    const newResume = new Resume(resumeData);
    await newResume.save();

    console.log('Resume saved successfully:', newResume);
    res.send('Resume saved successfully');
  } catch (error) {
    console.error('Error saving resume:', error.message);
    res.status(500).send('Error saving resume');
  }
});

app.get('/get-all-resumes', async (req, res) => {
  try {

    const allResumes = await Resume.find();
    res.json(allResumes);
  } catch (error) {
    console.error('Error fetching resumes:', error.message);
    res.status(500).send('Error fetching resumes');
  }
});

app.get('/get-resume/:resume_id', async (req, res) => {
  try {
    const { resume_id } = req.params;
    const resume = await Resume.findById(resume_id);

    if (resume) {
      res.status(200).json(resume);
    } else {
      res.status(404).json({ error: 'Resume not found' });
    }
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume data' });
  }
});

app.put('/update-resume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedResume = await Resume.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.status(200).json(updatedResume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

const port = process.env.API_PORT || 8800;
app.listen(port, () => {
  console.log(`Server is running - port ${port}`);
});
