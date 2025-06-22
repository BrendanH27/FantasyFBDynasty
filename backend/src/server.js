"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../database/db");
const setup_1 = require("../database/setup");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.put('/db_setup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, setup_1.db_setup)();
        console.log('DB Setup');
        res.sendStatus(200);
    }
    catch (error) {
        console.error('Error failed to setup db:', error);
        res.status(500).json({ error: 'Failed to setup db' });
    }
}));
app.get('/players', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDbConnection)();
        const teams = yield db.all('SELECT * FROM players');
        res.json(teams);
    }
    catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
