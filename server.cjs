var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_crypto2 = require("crypto");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = require("crypto");
var import_mongodb = require("mongodb");
var DB_FILE = import_path.default.join(process.cwd(), "medtech_db.json");
function getMongoDbName() {
  return (process.env.MONGO_DB_NAME || "MEDTECH3").trim();
}
function getMongoCollectionName() {
  return (process.env.MONGO_COLLECTION || "medtech3").trim();
}
function buildRuntimeLogEntry(payload = {}) {
  return {
    ...payload,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSeconds: Math.round(process.uptime()),
      memoryUsage: process.memoryUsage(),
      cwd: process.cwd(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
function createPasswordHash(password) {
  const salt = (0, import_crypto.randomBytes)(16).toString("hex");
  const hash = (0, import_crypto.scryptSync)(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPasswordHash(password, storedHash) {
  if (!storedHash) return false;
  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;
  const actualHash = (0, import_crypto.scryptSync)(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  return actualHash.length === expected.length && (0, import_crypto.timingSafeEqual)(actualHash, expected);
}
var importedAccounts = [
  { user: { id: "doc_2425002", role: "doctor", name: "Amarnath JS", email: "2425002@saec.ac.in" }, password: "Amarnath" },
  { user: { id: "doc_2425042", role: "doctor", name: "Sashank J", email: "2425042@saec.ac.in" }, password: "Sashank" },
  { user: { id: "pat_2425013", role: "patient", name: "Harish K", email: "2425013@saec.ac.in" }, password: "Harish" },
  { user: { id: "pat_2425025", role: "patient", name: "Madeshwar R", email: "2425025@saec.ac.in" }, password: "Madeshwar" },
  { user: { id: "pat_2425006", role: "patient", name: "Charukesh R", email: "2425006@saec.ac.in" }, password: "Charukesh" },
  { user: { id: "admin_2425001", role: "admin", name: "Abishek R", email: "2425001@saec.ac.in" }, password: "Abishek" }
];
var initialDbState = {
  runtimeLogs: [],
  passwordHashes: {},
  doctorApplications: {},
  users: [
    {
      id: "pat_1",
      role: "patient",
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+91 98765 40001",
      dateOfBirth: "1992-04-18",
      age: 34,
      gender: "Male",
      bloodGroup: "O+",
      emergencyContact: "+91 98765 41001"
    },
    {
      id: "pat_2",
      role: "patient",
      name: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "+91 98765 40002",
      dateOfBirth: "1997-08-22",
      age: 29,
      gender: "Female",
      bloodGroup: "A-",
      emergencyContact: "+91 98765 41002"
    },
    {
      id: "doc_1",
      role: "doctor",
      name: "Dr. Sarah Connor",
      email: "sarah@medtech.com",
      phoneNumber: "+91 98765 40003",
      dateOfBirth: "1985-11-14",
      age: 40,
      gender: "Female",
      specialty: "Cardiology",
      licenseNumber: "REG-MC-904218",
      experienceYears: 14,
      hospitalAffiliation: "MedTech Multi-Specialty Hospital",
      avatarUrl: ""
    },
    {
      id: "doc_2",
      role: "doctor",
      name: "Dr. James House",
      email: "house@medtech.com",
      phoneNumber: "+91 98765 40004",
      dateOfBirth: "1979-06-11",
      age: 47,
      gender: "Male",
      specialty: "Diagnostic & Internal Medicine",
      licenseNumber: "REG-MC-810239",
      experienceYears: 21,
      hospitalAffiliation: "MedTech Diagnostic Institute",
      avatarUrl: ""
    },
    {
      id: "doc_3",
      role: "doctor",
      name: "Dr. Elizabeth Blackwell",
      email: "elizabeth@medtech.com",
      phoneNumber: "+91 98765 40005",
      dateOfBirth: "1988-02-03",
      age: 38,
      gender: "Female",
      specialty: "General Medicine & Telehealth",
      licenseNumber: "REG-MC-720194",
      experienceYears: 11,
      hospitalAffiliation: "MedTech Health Center",
      avatarUrl: ""
    },
    {
      id: "admin_1",
      role: "admin",
      name: "System Admin",
      email: "admin@medtech.com",
      phoneNumber: "+91 98765 40006",
      dateOfBirth: "1986-09-25",
      age: 39,
      gender: "Male",
      staffId: "ADM-8891",
      department: "Hospital Administration & IT Security"
    }
  ],
  patientProfiles: {
    "pat_1": {
      userId: "pat_1",
      age: 34,
      dateOfBirth: "1992-04-18",
      gender: "Male",
      bloodGroup: "O+",
      phoneNumber: "+91 98765 40001",
      emergencyContact: "+91 98765 41001",
      height: 178,
      weight: 75,
      medicalHistory: ["Mild Hypertension", "Dust Allergy"],
      allergies: ["Penicillin", "Peanuts"],
      currentMedicines: ["Lisinopril 5mg (1-0-0)"],
      vaccinationHistory: ["COVID-19 Booster", "Influenza", "Hepatitis B"],
      labReports: [
        { id: "rep_1", title: "Complete Blood Count (CBC)", date: "2026-05-12", type: "PDF", url: "", analyzedSummary: "Overall normal profile. Hemoglobin at 15.2 g/dL. Mild elevation in WBC suggesting a minor past cold." },
        { id: "rep_2", title: "Lipid Profile Panel", date: "2026-06-01", type: "Image", url: "", analyzedSummary: "Total cholesterol is 210 mg/dL (slightly high). LDL is 130 mg/dL. Recommending a low-sodium Mediterranean diet." }
      ]
    },
    "pat_2": {
      userId: "pat_2",
      age: 29,
      dateOfBirth: "1997-08-22",
      gender: "Female",
      bloodGroup: "A-",
      phoneNumber: "+91 98765 40002",
      emergencyContact: "+91 98765 41002",
      height: 165,
      weight: 58,
      medicalHistory: ["Asthma"],
      allergies: ["Pollen"],
      currentMedicines: ["Albuterol Inhaler (As needed)"],
      vaccinationHistory: ["COVID-19 Full", "Tetanus Shot 2024"],
      labReports: []
    }
  },
  healthMetrics: {
    "pat_1": [
      { date: "2026-07-07", bloodPressureSystolic: 128, bloodPressureDiastolic: 84, sugarLevel: 98, heartRate: 72, bmi: 23.7, waterIntake: 2.1, sleep: 7.5, steps: 8500 },
      { date: "2026-07-08", bloodPressureSystolic: 125, bloodPressureDiastolic: 82, sugarLevel: 95, heartRate: 70, bmi: 23.7, waterIntake: 2.5, sleep: 8, steps: 10200 },
      { date: "2026-07-09", bloodPressureSystolic: 130, bloodPressureDiastolic: 85, sugarLevel: 105, heartRate: 75, bmi: 23.7, waterIntake: 1.8, sleep: 6.5, steps: 6e3 },
      { date: "2026-07-10", bloodPressureSystolic: 122, bloodPressureDiastolic: 80, sugarLevel: 92, heartRate: 68, bmi: 23.6, waterIntake: 3, sleep: 7.8, steps: 11e3 },
      { date: "2026-07-11", bloodPressureSystolic: 124, bloodPressureDiastolic: 81, sugarLevel: 94, heartRate: 71, bmi: 23.6, waterIntake: 2.8, sleep: 8.2, steps: 9400 },
      { date: "2026-07-12", bloodPressureSystolic: 126, bloodPressureDiastolic: 83, sugarLevel: 97, heartRate: 73, bmi: 23.6, waterIntake: 2.4, sleep: 7, steps: 8800 }
    ],
    "pat_2": [
      { date: "2026-07-10", bloodPressureSystolic: 115, bloodPressureDiastolic: 75, sugarLevel: 88, heartRate: 65, bmi: 21.3, waterIntake: 2, sleep: 8, steps: 9200 },
      { date: "2026-07-11", bloodPressureSystolic: 118, bloodPressureDiastolic: 78, sugarLevel: 90, heartRate: 67, bmi: 21.3, waterIntake: 2.2, sleep: 7.5, steps: 10500 },
      { date: "2026-07-12", bloodPressureSystolic: 114, bloodPressureDiastolic: 74, sugarLevel: 85, heartRate: 64, bmi: 21.3, waterIntake: 2.5, sleep: 8.5, steps: 11200 }
    ]
  },
  appointments: [
    { id: "apt_1", patientId: "pat_1", patientName: "John Doe", doctorId: "doc_1", doctorName: "Dr. Sarah Connor", specialty: "Cardiology", date: "2026-07-14", time: "10:00 AM", status: "approved", isEmergency: false, symptoms: "Occasional mild chest tightness during morning runs." },
    { id: "apt_2", patientId: "pat_2", patientName: "Jane Smith", doctorId: "doc_3", doctorName: "Dr. Elizabeth Blackwell", specialty: "General Medicine", date: "2026-07-15", time: "02:30 PM", status: "pending", isEmergency: false, symptoms: "Routine health checkup and allergy review." }
  ],
  prescriptions: [
    {
      id: "rx_1",
      appointmentId: "apt_1",
      patientId: "pat_1",
      patientName: "John Doe",
      doctorId: "doc_1",
      doctorName: "Dr. Sarah Connor",
      date: "2026-06-10",
      diagnosis: "Mild stress-induced blood pressure elevation",
      medicines: [
        { name: "Lisinopril 5mg", dosage: "1-0-0", duration: "30 days", instructions: "Take with water in the morning" },
        { name: "Coenzyme Q10", dosage: "0-1-0", duration: "30 days", instructions: "Take after lunch" }
      ],
      notes: "Monitor BP daily. Cut down on caffeine and processed sugars. Follow up in a month."
    }
  ],
  chatMessages: [
    { id: "msg_1", senderId: "pat_1", senderRole: "patient", receiverId: "doc_1", text: "Hello Dr. Sarah, I uploaded my latest lipid panel report. Can you look at it?", timestamp: "2026-07-12T10:15:00Z" },
    {
      id: "msg_2",
      senderId: "doc_1",
      senderRole: "doctor",
      receiverId: "pat_1",
      text: "Hi John, I reviewed your reports and symptoms. I have prepared your updated digital medicine prescription below. Please download the official PDF for your records and pharmacy purchase.",
      timestamp: "2026-07-12T11:00:00Z",
      prescriptionData: {
        rxId: "RX-894210",
        doctorName: "Dr. Sarah Connor",
        doctorSpecialty: "Cardiologist",
        patientName: "John Doe",
        patientAge: 34,
        patientGender: "Male",
        patientBlood: "O+",
        date: "2026-07-12",
        diagnosis: "Mild Hypertension & Lipid Optimization",
        medicines: [
          { name: "Lisinopril 5mg", dosage: "1-0-0", duration: "30 days", instructions: "Take with water in the morning" },
          { name: "Coenzyme Q10 100mg", dosage: "0-1-0", duration: "30 days", instructions: "Take after lunch" },
          { name: "Atorvastatin 10mg", dosage: "0-0-1", duration: "30 days", instructions: "Take 1 tablet at bedtime" }
        ],
        notes: "Maintain low-sodium diet, track morning BP daily, and drink 2.5L water."
      }
    }
  ],
  reminders: [
    { id: "rem_1", patientId: "pat_1", medicineName: "Lisinopril 5mg", time: "08:00 AM", dosage: "1 tablet", isActive: true },
    { id: "rem_2", patientId: "pat_1", medicineName: "Coenzyme Q10", time: "01:30 PM", dosage: "1 capsule", isActive: true }
  ],
  bloodDonors: [
    { id: "don_1", name: "Robert Downey", bloodGroup: "O+", city: "Chennai", hospital: "Apollo Hospitals", contactNumber: "+91 98765 40011", available: true },
    { id: "don_2", name: "Chris Evans", bloodGroup: "A-", city: "Chennai", hospital: "Fortis Malar Hospital", contactNumber: "+91 98765 40012", available: true },
    { id: "don_3", name: "Scarlett Johansson", bloodGroup: "B+", city: "Chennai", hospital: "Sri Ramachandra Medical Centre", contactNumber: "+91 98765 40013", available: true },
    { id: "don_4", name: "Mark Ruffalo", bloodGroup: "O-", city: "Chennai", hospital: "Apollo Hospitals", contactNumber: "+91 98765 40014", available: false }
  ],
  hospitals: [
    { id: "hosp_1", name: "Apollo Hospitals Chennai", type: "Hospital", address: "21 Greams Lane, Off Greams Road, Chennai, Tamil Nadu", distance: "1.4 km", contact: "+91 44 2829 3333", emergencyService: true, lat: 13.0604, lng: 80.2498 },
    { id: "hosp_2", name: "Fortis Malar Hospital", type: "Hospital", address: "52, 1st Main Rd, Gandhi Nagar, Adyar, Chennai", distance: "2.8 km", contact: "+91 44 4288 8000", emergencyService: true, lat: 13.0058, lng: 80.2545 },
    { id: "hosp_3", name: "Sri Ramachandra Medical Centre", type: "Hospital", address: "Porur, Chennai, Tamil Nadu", distance: "3.1 km", contact: "+91 44 2476 8020", emergencyService: true, lat: 13.0125, lng: 80.1697 },
    { id: "clinic_demo_1", name: "MedTech Community Clinic (Demo)", type: "Clinic", address: "Adyar, Chennai, Tamil Nadu", distance: "1.2 km", contact: "+91 90000 00001", emergencyService: false, lat: 13.0012, lng: 80.2565 },
    { id: "pharmacy_demo_1", name: "MedTech Pharmacy (Demo)", type: "Pharmacy", address: "Anna Nagar East, Chennai, Tamil Nadu", distance: "0.9 km", contact: "+91 90000 00002", emergencyService: false, lat: 13.083, lng: 80.2083 }
  ]
};
var DBManager = class {
  constructor() {
    this.mongoClient = null;
    this.runtimeCollection = null;
    this.mongoConnectPromise = null;
    this.startupPromise = null;
    this.data = initialDbState;
    this.load();
    const importedAccountsNow = this.importSuppliedAccounts();
    this.initializeDoctorVerificationStatuses();
    this.startupPromise = this.connectMongo().then(async () => {
      if (importedAccountsNow) await this.purgeLegacyMongoAccounts();
    });
  }
  initializeDoctorVerificationStatuses() {
    let changed = false;
    for (const user of this.data.users) {
      if (user.role !== "doctor" || user.doctorVerificationStatus) continue;
      user.doctorVerificationStatus = this.data.doctorApplications[user.id] ? "pending" : "approved";
      changed = true;
    }
    if (changed) this.save();
  }
  importSuppliedAccounts() {
    if (this.data.accountImportVersion === 3) return false;
    this.data.users = importedAccounts.map((account) => account.user);
    this.data.doctorApplications = {};
    for (const user of this.data.users) {
      if (user.role === "doctor") user.doctorVerificationStatus = "approved";
    }
    this.data.passwordHashes = Object.fromEntries(
      importedAccounts.map((account) => [account.user.id, createPasswordHash(account.password)])
    );
    this.data.patientProfiles = {};
    this.data.healthMetrics = {};
    this.data.appointments = [];
    this.data.prescriptions = [];
    this.data.chatMessages = [];
    this.data.reminders = [];
    this.data.runtimeLogs = [];
    this.data.accountImportVersion = 3;
    this.save();
    return true;
  }
  async purgeLegacyMongoAccounts() {
    if (!this.runtimeCollection) return;
    await this.runtimeCollection.deleteMany({
      documentType: { $in: ["user", "patientProfile", "runtimeLog"] }
    });
  }
  connectMongo() {
    if (!this.mongoConnectPromise) {
      this.mongoConnectPromise = this.connectMongoInternal().finally(() => {
        this.mongoConnectPromise = null;
      });
    }
    return this.mongoConnectPromise;
  }
  async connectMongoInternal() {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
    try {
      this.mongoClient = new import_mongodb.MongoClient(uri);
      await this.mongoClient.connect();
      const dbName = getMongoDbName();
      const collectionName = getMongoCollectionName();
      const db2 = this.mongoClient.db(dbName);
      this.runtimeCollection = db2.collection(collectionName);
      console.log(`[MongoDB] Connected to database "${dbName}" and collection "${collectionName}".`);
    } catch (error) {
      this.mongoClient = null;
      this.runtimeCollection = null;
      console.warn("[MongoDB] Not connected. Falling back to local storage. Set MONGO_URI, MONGO_DB_NAME, and MONGO_COLLECTION to enable MongoDB writes.", error);
    }
  }
  load() {
    try {
      if (import_fs.default.existsSync(DB_FILE)) {
        const raw = import_fs.default.readFileSync(DB_FILE, "utf8");
        this.data = JSON.parse(raw);
        this.data.users = this.data.users || initialDbState.users;
        this.data.passwordHashes = this.data.passwordHashes || {};
        this.data.doctorApplications = this.data.doctorApplications || {};
        this.data.patientProfiles = this.data.patientProfiles || initialDbState.patientProfiles;
        this.data.healthMetrics = this.data.healthMetrics || initialDbState.healthMetrics;
        this.data.appointments = this.data.appointments || initialDbState.appointments;
        this.data.prescriptions = this.data.prescriptions || initialDbState.prescriptions;
        this.data.chatMessages = this.data.chatMessages || initialDbState.chatMessages;
        this.data.reminders = this.data.reminders || initialDbState.reminders;
        this.data.bloodDonors = this.data.bloodDonors || initialDbState.bloodDonors;
        this.data.hospitals = this.data.hospitals || initialDbState.hospitals;
        this.data.runtimeLogs = this.data.runtimeLogs || initialDbState.runtimeLogs;
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Failed to load database. Using memory storage.", e);
    }
  }
  save() {
    try {
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf8");
    } catch (e) {
      console.error("Failed to write database file.", e);
    }
  }
  async persistMongoDocument(documentType, document) {
    try {
      if (!this.runtimeCollection) {
        await this.connectMongo();
      }
      if (this.runtimeCollection) {
        await this.runtimeCollection.insertOne({
          documentType,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          ...document
        });
      }
    } catch (error) {
      console.warn(`[MongoDB] Failed to persist ${documentType} record.`, error);
    }
  }
  // Getters & Setters
  getUsers() {
    return this.data.users;
  }
  async addUser(user, password, doctorApplication) {
    this.data.users.push(user);
    this.data.passwordHashes[user.id] = createPasswordHash(password);
    if (doctorApplication) this.data.doctorApplications[user.id] = doctorApplication;
    this.save();
    await this.persistMongoDocument("user", user);
    if (doctorApplication) {
      await this.persistMongoDocument("doctorApplication", doctorApplication);
    }
    return user;
  }
  verifyUserPassword(userId, password) {
    return verifyPasswordHash(password, this.data.passwordHashes[userId]);
  }
  getDoctorApplications() {
    return Object.values(this.data.doctorApplications);
  }
  async approveDoctorApplication(userId) {
    const application = this.data.doctorApplications[userId];
    const user = this.data.users.find((candidate) => candidate.id === userId && candidate.role === "doctor");
    if (!application || !user) return void 0;
    application.status = "approved";
    application.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
    user.doctorVerificationStatus = "approved";
    this.save();
    await this.persistMongoDocument("doctorApplication", application);
    await this.persistMongoDocument("user", user);
    return application;
  }
  async updateUserProfile(userId, updates) {
    const user = this.data.users.find((candidate) => candidate.id === userId);
    if (!user) return void 0;
    Object.assign(user, updates);
    const profile = this.data.patientProfiles[userId];
    if (profile) {
      if (updates.age !== void 0) profile.age = updates.age;
      if (updates.gender !== void 0) profile.gender = updates.gender;
      if (updates.bloodGroup !== void 0) profile.bloodGroup = updates.bloodGroup;
      if (updates.phoneNumber !== void 0) profile.phoneNumber = updates.phoneNumber;
      if (updates.dateOfBirth !== void 0) profile.dateOfBirth = updates.dateOfBirth;
      if (updates.emergencyContact !== void 0) profile.emergencyContact = updates.emergencyContact;
      if (updates.majorHealthIssue !== void 0) profile.majorHealthIssue = updates.majorHealthIssue;
    }
    this.save();
    await this.persistMongoDocument("user", user);
    if (profile) {
      await this.persistMongoDocument("patientProfile", { userId, ...profile });
    }
    return user;
  }
  getPatientProfile(userId) {
    return this.data.patientProfiles[userId];
  }
  async savePatientProfile(userId, profile) {
    this.data.patientProfiles[userId] = profile;
    this.save();
    await this.persistMongoDocument("patientProfile", { userId, ...profile });
    return profile;
  }
  getHealthMetrics(userId) {
    return this.data.healthMetrics[userId] || [];
  }
  addHealthMetric(userId, metric) {
    if (!this.data.healthMetrics[userId]) {
      this.data.healthMetrics[userId] = [];
    }
    this.data.healthMetrics[userId].push(metric);
    this.save();
    return metric;
  }
  getAppointments() {
    return this.data.appointments;
  }
  addAppointment(apt) {
    this.data.appointments.push(apt);
    this.save();
    return apt;
  }
  updateAppointmentStatus(id, status) {
    const apt = this.data.appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = status;
      this.save();
    }
    return apt;
  }
  getPrescriptions() {
    return this.data.prescriptions;
  }
  addPrescription(prescription) {
    this.data.prescriptions.push(prescription);
    this.save();
    return prescription;
  }
  getChatMessages(userId1, userId2) {
    return this.data.chatMessages.filter(
      (m) => m.senderId === userId1 && m.receiverId === userId2 || m.senderId === userId2 && m.receiverId === userId1
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  addChatMessage(msg) {
    this.data.chatMessages.push(msg);
    this.save();
    return msg;
  }
  getReminders(patientId) {
    return this.data.reminders.filter((r) => r.patientId === patientId);
  }
  addReminder(reminder) {
    this.data.reminders.push(reminder);
    this.save();
    return reminder;
  }
  deleteReminder(id) {
    this.data.reminders = this.data.reminders.filter((r) => r.id !== id);
    this.save();
  }
  toggleReminder(id) {
    const rem = this.data.reminders.find((r) => r.id === id);
    if (rem) {
      rem.isActive = !rem.isActive;
      this.save();
    }
    return rem;
  }
  getBloodDonors() {
    return this.data.bloodDonors;
  }
  addBloodDonor(donor) {
    this.data.bloodDonors.push(donor);
    this.save();
    return donor;
  }
  getHospitals() {
    return this.data.hospitals;
  }
  addHospital(hosp) {
    this.data.hospitals.push(hosp);
    this.save();
    return hosp;
  }
  async insertRuntimeLog(payload = {}) {
    const entry = buildRuntimeLogEntry(payload);
    try {
      if (!this.runtimeCollection) {
        await this.connectMongo();
      }
      if (this.runtimeCollection) {
        const result = await this.runtimeCollection.insertOne({
          ...entry,
          documentType: "runtimeLog",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        return { ...entry, _id: result.insertedId, documentType: "runtimeLog", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
      }
    } catch (error) {
      console.warn("[MongoDB] Insert failed, falling back to local runtime log storage.", error);
    }
    this.data.runtimeLogs.push(entry);
    this.save();
    return entry;
  }
  async getRuntimeLogs(limit = 50) {
    try {
      if (!this.runtimeCollection) {
        await this.connectMongo();
      }
      if (this.runtimeCollection) {
        return await this.runtimeCollection.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
      }
    } catch (error) {
      console.warn("[MongoDB] Read failed, falling back to local runtime logs.", error);
    }
    return this.data.runtimeLogs.slice(-limit).reverse();
  }
  async closeConnection() {
    await this.startupPromise;
    await this.mongoConnectPromise;
    await this.mongoClient?.close();
    this.mongoClient = null;
    this.runtimeCollection = null;
  }
  deleteDoctor(id) {
    this.data.users = this.data.users.filter((u) => !(u.id === id && u.role === "doctor"));
    this.save();
  }
  deletePatient(id) {
    this.data.users = this.data.users.filter((u) => !(u.id === id && u.role === "patient"));
    delete this.data.patientProfiles[id];
    delete this.data.healthMetrics[id];
    this.save();
  }
};
var db = new DBManager();

// server.ts
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
var OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
var app = (0, import_express.default)();
var PORT = 3e3;
var otpStore = /* @__PURE__ */ new Map();
var verifiedOtpEmails = /* @__PURE__ */ new Map();
app.use(import_express.default.json({ limit: "10mb" }));
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fallback to rule-based mock answers.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function callOpenRouter(params) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }
  const userPrompt = typeof params.contents === "string" ? params.contents : JSON.stringify(params.contents, null, 2);
  const systemInstruction = params.config?.systemInstruction || "You are a helpful AI assistant.";
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "MedTech AI"
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${errorBody}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  return {
    text: typeof text === "string" ? text : JSON.stringify(text ?? {}),
    raw: data
  };
}
function generateOtpCode() {
  return (0, import_crypto2.randomInt)(1e5, 1e6).toString();
}
async function sendOtpEmail(email, code) {
  const smtpUser = String(process.env.GMAIL_USER || "saecproject2026@gmail.com").trim();
  const smtpPass = String(process.env.GMAIL_APP_PASSWORD || "rlbkxfhldvqieyiy").replace(/\s+/g, "");
  const transporter = import_nodemailer.default.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
  await transporter.sendMail({
    from: `"MEDTECH 4" <${smtpUser}>`,
    to: email,
    subject: "MEDTECH 4 - Your Email Verification Code",
    text: `Your MEDTECH 4 verification code is ${code}. Use it to complete sign-in or registration. This code is valid for 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #dfe7f5; border-radius: 16px; background: #f8fbff;">
        <h2 style="color: #0f172a; margin-bottom: 10px;">MEDTECH 4 Email Verification</h2>
        <p style="color: #475569; line-height: 1.6;">Use the following code to verify your email address and complete sign-in or registration:</p>
        <div style="padding: 18px 20px; background: #0f172a; color: #ffffff; border-radius: 12px; font-size: 28px; letter-spacing: 4px; font-weight: 700; text-align: center; margin: 20px 0;">${code}</div>
        <p style="color: #64748b; margin: 0;">This code will expire in 5 minutes.</p>
      </div>
    `
  });
}
async function generateContentWithFallback(params) {
  if (OPENROUTER_API_KEY) {
    try {
      return await callOpenRouter(params);
    } catch (error) {
      console.warn("[OpenRouter] Request failed, falling back to Gemini.", error);
    }
  }
  const ai = getGeminiClient();
  const primaryModel = "gemini-3.5-flash";
  const fallbackModel = "gemini-3.1-flash-lite";
  const maxRetries = 2;
  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents: params.contents,
        config: params.config
      });
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`[Gemini API] Attempt ${attempt} failed with model ${primaryModel}:`, error?.message || error);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  console.warn(`[Gemini API] Falling back to secondary model ${fallbackModel} due to primary model failures.`);
  try {
    const response = await ai.models.generateContent({
      model: fallbackModel,
      contents: params.contents,
      config: params.config
    });
    return response;
  } catch (error) {
    console.error(`[Gemini API] Secondary model ${fallbackModel} also failed:`, error?.message || error);
    throw lastError || error;
  }
}
app.post("/api/auth/login", (req, res) => {
  res.status(410).json({ error: "Password-only sign-in is disabled. Request and verify the email OTP to sign in." });
});
app.post("/api/auth/send-otp", async (req, res) => {
  const { email, role } = req.body;
  if (!email || !String(email).trim()) {
    res.status(400).json({ error: "Email is required to send OTP." });
    return;
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const allowedRoles = ["patient", "doctor", "admin"];
  if (!allowedRoles.includes(role)) {
    res.status(400).json({ error: "Select a valid account role." });
    return;
  }
  if (db.getUsers().some((user) => user.email.toLowerCase() === normalizedEmail)) {
    res.status(409).json({ error: "This email is already registered. Sign in to request a login code." });
    return;
  }
  const code = generateOtpCode();
  otpStore.set(normalizedEmail, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1e3,
    payload: { email: normalizedEmail, role, purpose: "signup" }
  });
  verifiedOtpEmails.delete(normalizedEmail);
  try {
    await sendOtpEmail(normalizedEmail, code);
    res.json({ success: true, message: "OTP sent successfully to your email address." });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    otpStore.delete(normalizedEmail);
    verifiedOtpEmails.delete(normalizedEmail);
    res.status(500).json({
      error: "Unable to send OTP email. Check the Gmail app password and account settings, then try again.",
      details: error?.message || "SMTP delivery failed."
    });
  }
});
app.post("/api/auth/login/request-otp", async (req, res) => {
  const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();
  const { password, role } = req.body || {};
  if (!normalizedEmail || typeof password !== "string" || !["patient", "doctor", "admin"].includes(role)) {
    res.status(400).json({ error: "Email, password, and a valid role are required." });
    return;
  }
  const user = db.getUsers().find(
    (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.role === role
  );
  if (!user || !db.verifyUserPassword(user.id, password)) {
    res.status(401).json({ error: "Invalid email, password, or role." });
    return;
  }
  if (role === "doctor" && user.doctorVerificationStatus !== "approved") {
    res.status(403).json({
      error: user.doctorVerificationStatus === "rejected" ? "Your degree verification was not approved. Contact the administrator." : "Your degree file is awaiting administrator verification."
    });
    return;
  }
  const code = generateOtpCode();
  otpStore.set(normalizedEmail, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1e3,
    payload: { email: normalizedEmail, role, purpose: "login", userId: user.id }
  });
  verifiedOtpEmails.delete(normalizedEmail);
  try {
    await sendOtpEmail(normalizedEmail, code);
    res.json({ success: true, message: "Login code sent to your registered email address." });
  } catch (error) {
    console.error("Failed to send login OTP email:", error);
    otpStore.delete(normalizedEmail);
    res.status(500).json({
      error: "Unable to send a login code to this email address. Check email delivery settings and try again.",
      details: error?.message || "SMTP delivery failed."
    });
  }
});
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const stored = otpStore.get(normalizedEmail);
  if (!stored) {
    res.status(400).json({ error: "No OTP request found for this email address." });
    return;
  }
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedEmail);
    verifiedOtpEmails.delete(normalizedEmail);
    res.status(400).json({ error: "OTP expired. Please request a fresh code." });
    return;
  }
  if (String(stored.code) !== String(otp)) {
    res.status(400).json({ error: "Invalid OTP. Please check the code and try again." });
    return;
  }
  otpStore.delete(normalizedEmail);
  if (stored.payload.purpose === "login") {
    const user = db.getUsers().find(
      (candidate) => candidate.id === stored.payload.userId && candidate.role === stored.payload.role && candidate.email.toLowerCase() === normalizedEmail
    );
    if (!user) {
      res.status(401).json({ error: "Account is no longer available. Please try signing in again." });
      return;
    }
    res.json({
      success: true,
      purpose: "login",
      message: "Email verified successfully.",
      token: `mock-jwt-token-${user.id}`,
      user
    });
    return;
  }
  verifiedOtpEmails.set(normalizedEmail, String(stored.payload.role || "patient"));
  res.json({ success: true, purpose: "signup", message: "OTP verified successfully.", userData: stored.payload });
});
app.post("/api/auth/register", async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    dateOfBirth,
    age,
    gender,
    role,
    otp,
    password,
    bloodGroup,
    majorHealthIssue,
    emergencyContact,
    height,
    weight,
    specialty,
    licenseNumber,
    experienceYears,
    hospitalAffiliation,
    degreeFile,
    staffId,
    department
  } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    res.status(400).json({ error: "Email is required." });
    return;
  }
  if (typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters long." });
    return;
  }
  if (!["patient", "doctor", "admin"].includes(role)) {
    res.status(400).json({ error: "Select a valid account role." });
    return;
  }
  const supportedDegreeTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (role === "doctor") {
    const validDegreeFile = degreeFile && typeof degreeFile.name === "string" && degreeFile.name.trim() && typeof degreeFile.type === "string" && supportedDegreeTypes.includes(degreeFile.type) && typeof degreeFile.data === "string" && degreeFile.data.startsWith(`data:${degreeFile.type};base64,`) && degreeFile.data.length <= 7 * 1024 * 1024;
    if (!validDegreeFile) {
      res.status(400).json({ error: "Doctors must upload a valid PDF, JPG, or PNG degree file up to 5 MB." });
      return;
    }
  }
  const storedOtp = otpStore.get(normalizedEmail);
  const isVerified = verifiedOtpEmails.get(normalizedEmail) === role;
  if (!storedOtp && !isVerified) {
    res.status(400).json({ error: "Please request and verify an OTP before registering." });
    return;
  }
  if (storedOtp && String(storedOtp.code) !== String(otp)) {
    res.status(400).json({ error: "Incorrect OTP. Please verify your email again." });
    return;
  }
  if (storedOtp && otp !== void 0 && otp !== null && String(otp).trim() !== "") {
    otpStore.delete(normalizedEmail);
  }
  verifiedOtpEmails.delete(normalizedEmail);
  const users = db.getUsers();
  if (users.find((u) => u.email.toLowerCase() === normalizedEmail)) {
    otpStore.delete(normalizedEmail);
    res.status(400).json({ error: "This email address is already registered in the system." });
    return;
  }
  if (phoneNumber && users.find((u) => u.phoneNumber && u.phoneNumber.replace(/\D/g, "") === phoneNumber.replace(/\D/g, ""))) {
    otpStore.delete(normalizedEmail);
    res.status(400).json({ error: "This phone number is already registered in the system." });
    return;
  }
  const prefix = role === "patient" ? "pat" : role === "doctor" ? "doc" : "admin";
  const id = `${prefix}_${Date.now()}`;
  const newUser = {
    id,
    name: name.trim(),
    email: normalizedEmail,
    phoneNumber: phoneNumber ? phoneNumber.trim() : void 0,
    dateOfBirth: dateOfBirth || void 0,
    age: parseInt(age) || void 0,
    gender: gender || "Other",
    role,
    // Role specific fields
    specialty: role === "doctor" ? specialty : void 0,
    licenseNumber: role === "doctor" ? licenseNumber : void 0,
    experienceYears: role === "doctor" ? parseInt(experienceYears) || 5 : void 0,
    hospitalAffiliation: role === "doctor" ? hospitalAffiliation : void 0,
    staffId: role === "admin" ? staffId : void 0,
    department: role === "admin" ? department : void 0,
    bloodGroup: role === "patient" ? bloodGroup : void 0,
    majorHealthIssue: role === "patient" ? majorHealthIssue || void 0 : void 0,
    emergencyContact: role === "patient" ? emergencyContact : void 0,
    doctorVerificationStatus: role === "doctor" ? "pending" : void 0
  };
  const doctorApplication = role === "doctor" ? {
    userId: id,
    name: newUser.name,
    email: newUser.email,
    degreeFileName: import_path2.default.basename(degreeFile.name),
    degreeFileMimeType: degreeFile.type,
    degreeFileData: degreeFile.data,
    status: "pending",
    submittedAt: (/* @__PURE__ */ new Date()).toISOString()
  } : void 0;
  try {
    await db.addUser(newUser, password, doctorApplication);
    if (role === "patient") {
      await db.savePatientProfile(id, {
        userId: id,
        age: parseInt(age) || 30,
        dateOfBirth: dateOfBirth || "1996-01-01",
        gender: gender || "Other",
        bloodGroup: bloodGroup || "O+",
        phoneNumber: phoneNumber || void 0,
        majorHealthIssue: majorHealthIssue || void 0,
        emergencyContact: emergencyContact || void 0,
        height: parseInt(height) || 170,
        weight: parseInt(weight) || 65,
        medicalHistory: majorHealthIssue ? [majorHealthIssue] : [],
        allergies: [],
        currentMedicines: [],
        vaccinationHistory: [],
        labReports: []
      });
    }
    otpStore.delete(normalizedEmail);
    res.status(201).json({
      user: newUser,
      pendingApproval: role === "doctor",
      token: role === "doctor" ? void 0 : `mock-jwt-token-${id}`
    });
  } catch (error) {
    console.error("[Register] Failed to save user record.", error);
    res.status(500).json({ error: "Registration saved locally but database write failed. Please check MongoDB connection." });
  }
});
app.patch("/api/users/:id/profile", async (req, res) => {
  const updates = {};
  const editableTextFields = [
    "name",
    "phoneNumber",
    "dateOfBirth",
    "gender",
    "bloodGroup",
    "emergencyContact",
    "majorHealthIssue",
    "specialty",
    "licenseNumber",
    "hospitalAffiliation",
    "department"
  ];
  for (const field of editableTextFields) {
    const value = req.body?.[field];
    if (typeof value === "string") {
      updates[field] = value.trim();
    }
  }
  if (typeof req.body?.age === "number" && req.body.age >= 0) updates.age = req.body.age;
  if (typeof req.body?.experienceYears === "number" && req.body.experienceYears >= 0) {
    updates.experienceYears = req.body.experienceYears;
  }
  if (updates.name !== void 0 && !updates.name) {
    res.status(400).json({ error: "Name cannot be empty." });
    return;
  }
  const updatedUser = await db.updateUserProfile(req.params.id, updates);
  if (!updatedUser) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  res.json(updatedUser);
});
app.get("/api/patient/:id/profile", (req, res) => {
  const profile = db.getPatientProfile(req.params.id);
  if (profile) {
    res.json(profile);
  } else {
    res.status(404).json({ error: "Profile not found" });
  }
});
app.post("/api/patient/:id/profile", (req, res) => {
  const profile = db.savePatientProfile(req.params.id, req.body);
  res.json(profile);
});
app.get("/api/patient/:id/metrics", (req, res) => {
  res.json(db.getHealthMetrics(req.params.id));
});
app.post("/api/patient/:id/metrics", (req, res) => {
  const metric = db.addHealthMetric(req.params.id, req.body);
  res.json(metric);
});
app.get("/api/appointments", (req, res) => {
  const { patientId, doctorId } = req.query;
  let list = db.getAppointments();
  if (patientId) {
    list = list.filter((a) => a.patientId === patientId);
  }
  if (doctorId) {
    list = list.filter((a) => a.doctorId === doctorId);
  }
  res.json(list);
});
app.post("/api/appointments", (req, res) => {
  const apt = {
    id: `apt_${Date.now()}`,
    ...req.body,
    status: req.body.isEmergency ? "approved" : "pending"
    // Emergency auto-approved or pending doctor approval
  };
  db.addAppointment(apt);
  res.status(201).json(apt);
});
app.patch("/api/appointments/:id", (req, res) => {
  const { status } = req.body;
  const updated = db.updateAppointmentStatus(req.params.id, status);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: "Appointment not found" });
  }
});
app.get("/api/prescriptions", (req, res) => {
  const { patientId, doctorId } = req.query;
  let list = db.getPrescriptions();
  if (patientId) {
    list = list.filter((p) => p.patientId === patientId);
  }
  if (doctorId) {
    list = list.filter((p) => p.doctorId === doctorId);
  }
  res.json(list);
});
app.post("/api/prescriptions", (req, res) => {
  const prescription = {
    id: `rx_${Date.now()}`,
    ...req.body,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  db.addPrescription(prescription);
  res.status(201).json(prescription);
});
app.get("/api/chats", (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) {
    res.status(400).json({ error: "Both user1 and user2 query parameters are required" });
    return;
  }
  res.json(db.getChatMessages(user1, user2));
});
app.post("/api/chats", (req, res) => {
  const msg = {
    id: `msg_${Date.now()}`,
    ...req.body,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.addChatMessage(msg);
  res.status(201).json(msg);
});
app.post("/api/runtime/logs", async (req, res) => {
  const payload = req.body || {};
  const saved = await db.insertRuntimeLog(payload);
  res.status(201).json(saved);
});
app.get("/api/runtime/logs", async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const logs = await db.getRuntimeLogs(Number.isFinite(limit) && limit > 0 ? limit : 20);
  res.json(logs);
});
app.get("/api/reminders/:patientId", (req, res) => {
  res.json(db.getReminders(req.params.patientId));
});
app.post("/api/reminders", (req, res) => {
  const reminder = {
    id: `rem_${Date.now()}`,
    ...req.body,
    isActive: true
  };
  db.addReminder(reminder);
  res.status(201).json(reminder);
});
app.patch("/api/reminders/:id/toggle", (req, res) => {
  const updated = db.toggleReminder(req.params.id);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: "Reminder not found" });
  }
});
app.delete("/api/reminders/:id", (req, res) => {
  db.deleteReminder(req.params.id);
  res.json({ success: true });
});
app.get("/api/donors", (req, res) => {
  const { bloodGroup, city } = req.query;
  let list = db.getBloodDonors();
  if (bloodGroup) {
    list = list.filter((d) => d.bloodGroup === bloodGroup);
  }
  if (city) {
    list = list.filter((d) => d.city.toLowerCase().includes(city.toLowerCase()));
  }
  res.json(list);
});
app.post("/api/donors", (req, res) => {
  const donor = {
    id: `don_${Date.now()}`,
    ...req.body,
    available: true
  };
  db.addBloodDonor(donor);
  res.status(201).json(donor);
});
app.get("/api/hospitals", (req, res) => {
  res.json(db.getHospitals());
});
app.get("/api/admin/users", (req, res) => {
  res.json(db.getUsers());
});
app.get("/api/doctors", (req, res) => {
  const doctors = db.getUsers().filter((user) => user.role === "doctor" && user.doctorVerificationStatus === "approved").map(({ id, name, specialty }) => ({ id, name, specialty: specialty || "Doctor" }));
  res.json(doctors);
});
app.get("/api/admin/doctor-applications", (req, res) => {
  res.json(db.getDoctorApplications());
});
app.post("/api/admin/doctor-applications/:userId/verify", async (req, res) => {
  const application = await db.approveDoctorApplication(req.params.userId);
  if (!application) {
    res.status(404).json({ error: "Doctor application not found." });
    return;
  }
  res.json({ success: true, application });
});
app.get("/api/admin/analytics", (req, res) => {
  const appointments = db.getAppointments();
  const totalUsers = db.getUsers().length;
  const totalDoctors = db.getUsers().filter((u) => u.role === "doctor").length;
  const totalPatients = db.getUsers().filter((u) => u.role === "patient").length;
  const emergencyCount = appointments.filter((a) => a.isEmergency).length;
  const appointmentsPerDoctor = {};
  appointments.forEach((a) => {
    appointmentsPerDoctor[a.doctorName] = (appointmentsPerDoctor[a.doctorName] || 0) + 1;
  });
  res.json({
    totalUsers,
    totalDoctors,
    totalPatients,
    emergencyCount,
    appointmentStats: {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      approved: appointments.filter((a) => a.status === "approved").length,
      completed: appointments.filter((a) => a.status === "completed").length
    },
    doctorDistribution: Object.entries(appointmentsPerDoctor).map(([name, count]) => ({ name, count })),
    hospitalsCount: db.getHospitals().length,
    donorsCount: db.getBloodDonors().length
  });
});
app.delete("/api/admin/doctors/:id", (req, res) => {
  db.deleteDoctor(req.params.id);
  res.json({ success: true });
});
app.delete("/api/admin/patients/:id", (req, res) => {
  db.deletePatient(req.params.id);
  res.json({ success: true });
});
app.post("/api/ai/chatbot", async (req, res) => {
  const { message, history } = req.body;
  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  const msgLower = (message || "").toLowerCase();
  const getFallbackMedicines = (text) => {
    const t = text.toLowerCase();
    if (t.includes("fever") || t.includes("headache") || t.includes("pain") || t.includes("body ache")) {
      return [
        { name: "Paracetamol 500mg", dosage: "1-0-1", duration: "3 days", instructions: "Take with water after meals when fever/pain occurs" },
        { name: "Vitamin C 500mg + Zinc", dosage: "1-0-0", duration: "7 days", instructions: "Chewable tablet after breakfast" },
        { name: "Oral Electrolyte Hydration", dosage: "As needed", duration: "3 days", instructions: "Dissolve in 1L clean drinking water" }
      ];
    } else if (t.includes("cold") || t.includes("cough") || t.includes("throat") || t.includes("flu")) {
      return [
        { name: "Cetirizine 10mg", dosage: "0-0-1", duration: "5 days", instructions: "Take 1 tablet at bedtime for allergy/sneezing" },
        { name: "Dextromethorphan / Herbal Cough Syrup", dosage: "2 tsp Twice Daily", duration: "5 days", instructions: "Take after warm water" },
        { name: "Warm Saline Gargle / Lozenges", dosage: "3-4 times daily", duration: "5 days", instructions: "Soothe irritated throat" }
      ];
    } else if (t.includes("stomach") || t.includes("acid") || t.includes("gastric") || t.includes("digest") || t.includes("nausea")) {
      return [
        { name: "Pantoprazole 40mg", dosage: "1-0-0", duration: "5 days", instructions: "Take 30 minutes before breakfast" },
        { name: "Oral Rehydration Salts (ORS)", dosage: "1-2 liters daily", duration: "3 days", instructions: "Sip throughout the day" },
        { name: "Probiotics Capsule", dosage: "0-1-0", duration: "7 days", instructions: "Take with lunch to restore gut flora" }
      ];
    } else if (t.includes("allergy") || t.includes("rash") || t.includes("itch")) {
      return [
        { name: "Levocetirizine 5mg", dosage: "0-0-1", duration: "5 days", instructions: "Take at night" },
        { name: "Calamine Cooling Lotion", dosage: "Apply twice daily", duration: "5 days", instructions: "Topical application over affected areas" }
      ];
    } else if (t.includes("vitamin") || t.includes("diet") || t.includes("energy") || t.includes("weak") || t.includes("health")) {
      return [
        { name: "Multivitamin & Mineral Complex", dosage: "1-0-0", duration: "30 days", instructions: "Take with breakfast" },
        { name: "Vitamin D3 2000 IU", dosage: "1-0-0", duration: "30 days", instructions: "Take with meals" },
        { name: "Omega-3 Fish Oil 1000mg", dosage: "0-1-0", duration: "30 days", instructions: "Take after lunch" }
      ];
    }
    return void 0;
  };
  if (!hasApiKey) {
    let replyText = `I am your MedTech AI Assistant. (Running in offline demo mode. Set GEMINI_API_KEY in Secrets for live AI responses.)

Based on your query "${message}":
\u2022 Maintain good hydration and restful recovery.
\u2022 For mild discomfort, follow standard supportive care and dosage.
\u2022 Please consult a certified doctor for personalized diagnosis.`;
    if (msgLower.includes("fever") || msgLower.includes("cold") || msgLower.includes("cough")) {
      replyText = `For fever, headache, or cold symptoms:
\u2022 Rest adequately and drink at least 2.5-3L of warm fluids.
\u2022 Monitor body temperature twice daily.
\u2022 You can download the recommended supportive medicine PDF schedule below or add reminders directly to your dashboard.`;
    } else if (msgLower.includes("stomach") || msgLower.includes("acid") || msgLower.includes("gas")) {
      replyText = `For digestive or acidity discomfort:
\u2022 Avoid spicy, greasy, or deep-fried foods.
\u2022 Eat smaller, frequent bland meals (oats, bananas, rice).
\u2022 Review the supportive medications table below and export your Care PDF.`;
    }
    const meds = getFallbackMedicines(message);
    res.json({
      reply: replyText,
      medicines: meds,
      suggestedDiagnosis: meds ? "Symptomatic Relief & General Care" : void 0
    });
    return;
  }
  try {
    const ai = getGeminiClient();
    const systemInstruction = `You are an expert, empathetic AI Medical Assistant named "MedTech AI". 
You answer healthcare questions, explain diseases simply, suggest supportive over-the-counter first-aid / medicine regimens, and provide clean advice.
CRITICAL MANDATES:
1. Always state that this guidance does not replace an in-person clinical doctor evaluation.
2. If severe emergency symptoms are described (chest pain, shortness of breath, severe trauma), advise immediate emergency clinic contact.
3. If the user asks about symptoms, ailments, or medicines, provide clear empathetic text in the 'reply' field AND also provide structured 'medicines' array if safe over-the-counter or supportive remedies are applicable (with name, dosage like 1-0-1, duration, and instructions).
4. Return a valid JSON object matching:
{
  "reply": "Conversational message text with key bullet points...",
  "suggestedDiagnosis": "Optional suspected condition or health topic",
  "medicines": [
    { "name": "Medicine / Remedy Name & Strength", "dosage": "1-0-1", "duration": "3-5 days", "instructions": "After meals with water" }
  ]
}`;
    const chatHistory = history?.map((h) => ({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    })) || [];
    const response = await generateContentWithFallback({
      contents: [
        ...chatHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });
    try {
      const parsed = JSON.parse(response.text || "{}");
      res.json({
        reply: parsed.reply || response.text,
        medicines: parsed.medicines && parsed.medicines.length > 0 ? parsed.medicines : getFallbackMedicines(message),
        suggestedDiagnosis: parsed.suggestedDiagnosis
      });
    } catch {
      res.json({
        reply: response.text,
        medicines: getFallbackMedicines(message)
      });
    }
  } catch (error) {
    console.error("Gemini chatbot error (falling back to clinical assistant):", error);
    const meds = getFallbackMedicines(message);
    let responseText = `Hello! I am your MedTech AI Assistant. For minor symptoms: stay hydrated, rest well, and follow the structured medication schedule provided below. You can download the complete prescription PDF using the button attached.`;
    res.json({
      reply: `[Clinical Care Backup] ${responseText}`,
      medicines: meds,
      suggestedDiagnosis: "Supportive Symptomatic Care"
    });
  }
});
app.post("/api/ai/predict-disease", async (req, res) => {
  const { symptoms, gender, age } = req.body;
  const getFallbackPrediction = () => {
    const symLower = (symptoms || "").toLowerCase();
    let risk = 15;
    let disease = "Common Cold / Physical Fatigue";
    let specialist = "General Physician";
    let measures = ["Ensure 8 hours of deep sleep.", "Stay hydrated (2-3L water).", "Take vitamin C and monitor core body temperature."];
    let medicines = [
      { name: "Paracetamol 500mg", dosage: "1-0-1", duration: "3 days", instructions: "Take after meals for fever/headache" },
      { name: "Vitamin C 500mg Chewable", dosage: "1-0-0", duration: "7 days", instructions: "After breakfast" }
    ];
    if (symLower.includes("chest") || symLower.includes("heart") || symLower.includes("breath")) {
      risk = 45;
      disease = "Potential Cardiovascular Strain";
      specialist = "Cardiologist";
      measures = ["Avoid vigorous exercise immediately.", "Track blood pressure and heart rate.", "Seek prompt medical diagnostic tests like an ECG."];
      medicines = [
        { name: "Aspirin 75mg (Consult Doctor First)", dosage: "0-1-0", duration: "As directed", instructions: "Take after food if prescribed by physician" },
        { name: "Coenzyme Q10 100mg", dosage: "1-0-0", duration: "30 days", instructions: "Cardiovascular supportive antioxidant" }
      ];
    } else if (symLower.includes("sugar") || symLower.includes("thirst") || symLower.includes("urine")) {
      risk = 35;
      disease = "Impaired Glucose Tolerance (Pre-diabetes)";
      specialist = "Endocrinologist";
      measures = ["Significantly reduce refined sugar intake.", "Integrate 30 mins daily walking.", "Schedule a fasting blood glucose and HbA1c lab test."];
      medicines = [
        { name: "Chromium Picolinate / Alpha Lipoic Acid", dosage: "1-0-0", duration: "30 days", instructions: "Supportive glucose metabolic supplement" },
        { name: "Cinnamon Bark Extract 500mg", dosage: "0-1-0", duration: "30 days", instructions: "Take with lunch" }
      ];
    } else if (symLower.includes("skin") || symLower.includes("itch") || symLower.includes("rash")) {
      risk = 25;
      disease = "Allergic Dermatitis / Eczema";
      specialist = "Dermatologist";
      measures = ["Avoid using heavily scented skin soaps.", "Apply a cooling hypoallergenic moisturizer.", "Note down triggering foods or environmental allergens."];
      medicines = [
        { name: "Cetirizine 10mg", dosage: "0-0-1", duration: "5 days", instructions: "Night time for anti-itch relief" },
        { name: "Hydrocortisone 1% Cream (Topical)", dosage: "Apply 2x daily", duration: "5 days", instructions: "Apply thin layer to affected skin" }
      ];
    }
    return {
      possibleDisease: disease,
      riskPercentage: risk,
      preventiveMeasures: measures,
      recommendedMedicines: medicines,
      recommendedDoctor: specialist,
      isMock: true
    };
  };
  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (!hasApiKey) {
    res.json(getFallbackPrediction());
    return;
  }
  try {
    const ai = getGeminiClient();
    const prompt = `Perform a comprehensive risk assessment for symptoms: "${symptoms}". Gender: ${gender}, Age: ${age}.
Include recommended supportive medications / OTC remedies where safe.
Respond with a valid JSON object matching this schema exactly:
{
  "possibleDisease": "Name of primary suspect disease",
  "riskPercentage": 45, // integer percentage
  "preventiveMeasures": ["measure 1", "measure 2", "measure 3"],
  "recommendedMedicines": [
    { "name": "Medicine Name & Strength", "dosage": "1-0-1", "duration": "5 days", "instructions": "After food with water" }
  ],
  "recommendedDoctor": "Cardiologist / Endocrinologist / etc."
}`;
    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            possibleDisease: { type: import_genai.Type.STRING },
            riskPercentage: { type: import_genai.Type.INTEGER },
            preventiveMeasures: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            recommendedMedicines: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  name: { type: import_genai.Type.STRING },
                  dosage: { type: import_genai.Type.STRING },
                  duration: { type: import_genai.Type.STRING },
                  instructions: { type: import_genai.Type.STRING }
                },
                required: ["name", "dosage", "duration", "instructions"]
              }
            },
            recommendedDoctor: { type: import_genai.Type.STRING }
          },
          required: ["possibleDisease", "riskPercentage", "preventiveMeasures", "recommendedMedicines", "recommendedDoctor"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Gemini prediction error (falling back to clinical rules):", error);
    res.json(getFallbackPrediction());
  }
});
app.post("/api/ai/diet-plan", async (req, res) => {
  const { age, gender, medicalHistory, goals } = req.body;
  const getFallbackPlan = () => {
    const historyStr = JSON.stringify(medicalHistory || []).toLowerCase();
    const goalsStr = (goals || "").toLowerCase();
    let breakfast = "Oatmeal with chia seeds, banana, walnuts, and almond milk";
    let lunch = "Grilled chicken breast quinoa bowl with avocados, cherry tomatoes, and fresh spinach";
    let dinner = "Steamed salmon filet with roasted broccoli florets and wild sweet potato";
    let fruits = "Fresh organic blueberries, sweet raspberries, and raw unsalted almonds";
    let waterIntake = "2.5 to 3.0 Liters of pure water daily";
    let exercisePlan = "30 minutes of cardiovascular walking daily and 2 light yoga/stretching sessions weekly.";
    if (historyStr.includes("hypertension") || historyStr.includes("heart") || historyStr.includes("bp") || historyStr.includes("pressure") || goalsStr.includes("hypertension") || goalsStr.includes("heart") || goalsStr.includes("pressure")) {
      breakfast = "Sodium-free steel-cut oats with blueberries, flaxseeds, and unsalted walnuts";
      lunch = "Low-sodium grilled skinless chicken salad with baby spinach, raw cucumber, and extra virgin olive oil";
      dinner = "Baked wild-caught trout with steamed lemon asparagus and boiled sweet potato (no added table salt)";
      fruits = "Fresh red apples, potassium-rich bananas, and sliced oranges";
      waterIntake = "2.5 Liters of water daily (strict restriction of caffeine and energy drinks)";
      exercisePlan = "30-40 minutes of moderate-intensity aerobic exercise (steady brisk walking or cycling) 4 times a week.";
    } else if (historyStr.includes("diabetes") || historyStr.includes("sugar") || historyStr.includes("diabetic") || goalsStr.includes("diabetes") || goalsStr.includes("sugar") || goalsStr.includes("glycemic")) {
      breakfast = "Scrambled organic eggs (2) with saut\xE9ed spinach, mushrooms, sliced avocado, and organic green tea";
      lunch = "Wild-caught tuna over dark mixed leafy greens with cucumber, pumpkin seeds, and avocado oil dressing";
      dinner = "Baked garlic cod with seasoned steamed broccoli, cauliflower rice, and thin green beans";
      fruits = "Low-glycemic strawberries, blackberries, and fresh walnuts";
      waterIntake = "3.0 Liters of water daily to maintain metabolic hydration and support insulin sensitivity";
      exercisePlan = "30 minutes of aerobic walking daily, combined with light bodyweight exercises 3 times a week.";
    } else if (goalsStr.includes("muscle") || goalsStr.includes("stamina") || goalsStr.includes("build") || goalsStr.includes("strength") || goalsStr.includes("fat") || goalsStr.includes("lose") || goalsStr.includes("weight")) {
      breakfast = "High-protein oatmeal made with whey protein, chia seeds, banana, and natural peanut butter";
      lunch = "Lean turkey breast strip bowl with roasted sweet potato, broccoli, and steamed brown jasmine rice";
      dinner = "Grilled lean beef sirloin or high-protein organic tofu with grilled asparagus, carrots, and quinoa";
      fruits = "Bananas, kiwi, oranges, and mixed pumpkin/sunflower seed mix";
      waterIntake = "3.5 Liters of water daily to optimize muscle hydration and protein synthesis";
      exercisePlan = "45-60 minutes of progressive resistance training (weightlifting or calisthenics) 3-4 times a week.";
    }
    return { breakfast, lunch, dinner, fruits, waterIntake, exercisePlan, isFallback: true };
  };
  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (!hasApiKey) {
    res.json(getFallbackPlan());
    return;
  }
  try {
    const ai = getGeminiClient();
    const prompt = `Create a healthy daily meal diet plan and simple exercise routine for a person of Age: ${age}, Gender: ${gender}, Medical conditions: ${JSON.stringify(medicalHistory || [])}, Fitness focus: "${goals || "General fitness"}".
Respond with a valid JSON matching this schema exactly:
{
  "breakfast": "Oatmeal with almonds...",
  "lunch": "Salad with baked salmon...",
  "dinner": "Vegetable stir-fry...",
  "fruits": "Berries and citrus fruits...",
  "waterIntake": "3 Liters daily...",
  "exercisePlan": "30 mins walking daily..."
}`;
    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            breakfast: { type: import_genai.Type.STRING },
            lunch: { type: import_genai.Type.STRING },
            dinner: { type: import_genai.Type.STRING },
            fruits: { type: import_genai.Type.STRING },
            waterIntake: { type: import_genai.Type.STRING },
            exercisePlan: { type: import_genai.Type.STRING }
          },
          required: ["breakfast", "lunch", "dinner", "fruits", "waterIntake", "exercisePlan"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Gemini diet planner error (falling back to customized plan):", error);
    res.json(getFallbackPlan());
  }
});
app.post("/api/ai/doctor-diagnosis", async (req, res) => {
  const { symptoms, history, patientAge, patientGender } = req.body;
  const getFallbackSuggestions = () => {
    return {
      suggestions: [
        "Perform basic blood chemistry panel & CBC check to rule out underlying infections.",
        "Consider ordering a targeted non-invasive screening (e.g. ECG, Abdominal Ultrasound).",
        "Review current active prescription lists to rule out potential medication interaction symptoms."
      ]
    };
  };
  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (!hasApiKey) {
    res.json(getFallbackSuggestions());
    return;
  }
  try {
    const ai = getGeminiClient();
    const prompt = `You are a clinical assistant supporting a licensed physician. 
Review Patient details: Age: ${patientAge}, Gender: ${patientGender}, Symptoms: "${symptoms}", History: ${JSON.stringify(history || [])}.
Provide 3 structured clinical diagnosis checks or next diagnostic steps. Return as a JSON object:
{ "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"] }`;
    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            suggestions: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            }
          },
          required: ["suggestions"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Gemini doctor diagnosis suggestion error (falling back):", error);
    res.json(getFallbackSuggestions());
  }
});
app.post("/api/ai/summarize-report", async (req, res) => {
  const { reportTitle, fileContentBase64 } = req.body;
  const getFallbackSummary = () => {
    return {
      summary: `Clinical Summary (MOCK DEMO):
This report ("${reportTitle || "Complete Blood Panel"}") displays solid metabolic indicators. Electrolytes, kidney enzymes, and liver function assays fall within normal clinical reference limits. Mild iron stores (ferritin) fluctuation is identified.

Recommendations:
1. Increase dietary intake of iron-rich foods such as spinach, lean poultry, and green leafy vegetables.
2. Maintain proper daily hydration and consult with your physician if any symptoms persist.`
    };
  };
  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  if (!hasApiKey) {
    res.json(getFallbackSummary());
    return;
  }
  try {
    const ai = getGeminiClient();
    let contents = `Analyze this lab report titled: "${reportTitle}". Summarize key clinical findings clearly for the patient. Indicate positive points and critical items requiring attention. Highlight recommendations.`;
    if (fileContentBase64) {
      const isImg = fileContentBase64.startsWith("data:image");
      const mime = isImg ? fileContentBase64.split(";")[0].split(":")[1] : "application/pdf";
      const actualBase64 = fileContentBase64.split(",")[1] || fileContentBase64;
      const filePart = {
        inlineData: {
          mimeType: mime,
          data: actualBase64
        }
      };
      contents = {
        parts: [
          filePart,
          { text: `This is a lab report titled "${reportTitle}". Extract the medical findings from this image/document and write an easy-to-understand executive summary for the patient. Mention normal vs abnormal parameters, and advice.` }
        ]
      };
    }
    const response = await generateContentWithFallback({
      contents
    });
    res.json({ summary: response.text });
  } catch (error) {
    console.error("Report summarizer error (falling back to mock summary):", error);
    res.json(getFallbackSummary());
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
