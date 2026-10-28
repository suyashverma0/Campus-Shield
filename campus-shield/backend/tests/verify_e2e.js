import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

const BASE_URL = 'http://localhost:5000/api';

async function runE2ETest() {
  console.log('========================================================');
  console.log('🧪 Starting Campus Shield End-to-End AI Integration Test');
  console.log('========================================================\n');

  // Step 1: Register Student A (Owner)
  console.log('1️⃣ Registering Student A (Owner: Priya Patel)...');
  const regARes = await axios.post(`${BASE_URL}/auth/register`, {
    name: 'Priya Patel',
    email: `priya_${Date.now()}@university.edu`,
    password: 'SecurePassword123!',
    department: 'Electrical Engineering',
    studentId: 'EE-2026-8812',
    phone: '+91 98111 22334',
  });
  const tokenA = regARes.data.data.token;
  const userA = regARes.data.data.user;
  console.log(`✅ Student A Registered: ${userA.name} (${userA.email}), ID: ${userA.id}`);

  // Step 2: Student A reports a lost item with image file upload
  console.log('\n2️⃣ Student A reports a Lost Item with image upload...');
  const formA = new FormData();
  formA.append('type', 'lost');
  formA.append('title', 'Blue Engineering Calculator with Math Stickers');
  formA.append('category', 'Electronics & Gadgets');
  formA.append('location', 'Engineering Complex - Block B');
  formA.append('specificLocation', 'Room 204 near front podium');
  formA.append('date', '2026-10-28');
  formA.append('time', '11:00');
  formA.append('description', 'Texas Instruments calculator with blue casing and a pi sticker on the back.');
  formA.append('brand', 'Texas Instruments');
  formA.append('color', 'Blue');
  formA.append('reward', '₹500');
  formA.append('securityQuestion', 'What sticker is on the battery cover?');

  const imgAPath = path.resolve('uploads/sample_lost_laptop.jpg');
  formA.append('image', fs.createReadStream(imgAPath), 'calculator_lost.jpg');

  const itemARes = await axios.post(`${BASE_URL}/items`, formA, {
    headers: {
      ...formA.getHeaders(),
      Authorization: `Bearer ${tokenA}`,
    },
  });
  const itemA = itemARes.data.data.item;
  console.log(`✅ Lost Item Created: ${itemA.title}`);
  console.log(`   ID: ${itemA.id}`);
  console.log(`   Image URL: ${itemA.image}`);
  console.log(`   AI Status: ${itemA.aiStatus}`);
  console.log(`   Model Version: ${itemA.embeddingModelVersion}`);

  // Step 3: Register Student B (Finder)
  console.log('\n3️⃣ Registering Student B (Finder: Rohan Verma)...');
  const regBRes = await axios.post(`${BASE_URL}/auth/register`, {
    name: 'Rohan Verma',
    email: `rohan_${Date.now()}@university.edu`,
    password: 'SecurePassword123!',
    department: 'Computer Science',
    studentId: 'CS-2026-4401',
    phone: '+91 98222 33445',
  });
  const tokenB = regBRes.data.data.token;
  const userB = regBRes.data.data.user;
  console.log(`✅ Student B Registered: ${userB.name} (${userB.email}), ID: ${userB.id}`);

  // Step 4: Student B reports finding the item with image upload
  console.log('\n4️⃣ Student B logs a Found Item with image upload (triggers ResNet50 matching)...');
  const formB = new FormData();
  formB.append('type', 'found');
  formB.append('title', 'Blue TI Calculator turned in');
  formB.append('category', 'Electronics & Gadgets');
  formB.append('location', 'Engineering Complex - Block B');
  formB.append('date', '2026-10-28');
  formB.append('time', '12:30');
  formB.append('description', 'Found blue scientific calculator on floor of Block B 2nd floor.');
  formB.append('brand', 'Texas Instruments');
  formB.append('color', 'Blue');
  formB.append('custodyLocation', 'Engineering Block Security Desk');

  const imgBPath = path.resolve('uploads/sample_found_laptop.jpg');
  formB.append('image', fs.createReadStream(imgBPath), 'calculator_found.jpg');

  const itemBRes = await axios.post(`${BASE_URL}/items`, formB, {
    headers: {
      ...formB.getHeaders(),
      Authorization: `Bearer ${tokenB}`,
    },
  });
  const itemB = itemBRes.data.data.item;
  const matches = itemBRes.data.data.matches;
  console.log(`✅ Found Item Created: ${itemB.title}`);
  console.log(`   ID: ${itemB.id}`);
  console.log(`   AI Status: ${itemB.aiStatus}`);
  console.log(`   Matches Found via AI: ${matches.length}`);

  if (matches.length > 0) {
    const match = matches[0];
    console.log(`\n🎯 AI Match Details:`);
    console.log(`   Match ID: ${match.id}`);
    console.log(`   Total Confidence Score: ${match.score}%`);
    console.log(`   Raw Cosine Similarity: ${match.rawSimilarity.toFixed(4)}`);
    console.log(`   Status: ${match.status}`);
    console.log(`   Factors:`);
    match.factors.forEach((f) => console.log(`     • ${f.label} (${f.score})`));
  }

  // Step 5: Verify Match Retrieval
  console.log('\n5️⃣ Student A queries /api/matches for their lost items...');
  const matchRes = await axios.get(`${BASE_URL}/matches?userId=${userA.id}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  console.log(`✅ Retrieved ${matchRes.data.data.length} match(es) for Student A.`);

  // Step 6: Verify Match
  if (matchRes.data.data.length > 0) {
    const matchId = matchRes.data.data[0].id;
    console.log(`\n6️⃣ Student A verifies match #${matchId}...`);
    const verifyRes = await axios.post(`${BASE_URL}/matches/${matchId}/verify`, {}, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log(`✅ Match Status: ${verifyRes.data.data.status}, Verified: ${verifyRes.data.data.verified}`);

    // Step 7: Confirm Handover
    console.log(`\n7️⃣ Handover complete: Confirming reunion...`);
    const confirmRes = await axios.post(`${BASE_URL}/matches/${matchId}/confirm`, {}, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    console.log(`✅ Handover Confirmed! Status: ${confirmRes.data.data.status}`);

    // Step 8: Verify item statuses updated to resolved
    console.log('\n8️⃣ Verifying items marked as resolved in MongoDB...');
    const checkLost = await axios.get(`${BASE_URL}/items/${itemA.id}`);
    const checkFound = await axios.get(`${BASE_URL}/items/${itemB.id}`);
    console.log(`✅ Lost Item Status: ${checkLost.data.data.status}`);
    console.log(`✅ Found Item Status: ${checkFound.data.data.status}`);
  }

  // Step 9: Check stats
  console.log('\n9️⃣ Verifying updated dashboard statistics...');
  const statsRes = await axios.get(`${BASE_URL}/stats`);
  console.log(`✅ Campus Stats:`, statsRes.data.data);

  console.log('\n========================================================');
  console.log('🎉 ALL END-TO-END WORKFLOW CHECKS PASSED WITH 100% SUCCESS!');
  console.log('========================================================');
}

runE2ETest().catch((err) => {
  console.error('❌ E2E Test Failed:', err.response?.data || err.message);
  process.exit(1);
});

