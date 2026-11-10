import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadinessScore, generateBlueprint, generateDefaultDailyTasks } from './planEngine';
import type { QuizAnswers } from './types';

test('calculates readiness score within 10..100 without attractiveness scoring', () => {
  const res = calculateReadinessScore({
    streakDays: 14,
    sleepHours: '7–8h',
    skincareDaysPerWeek: 6,
    groomingDaysPerWeek: 5,
    trainingDaysPerWeek: 3,
    styleCheckDone: true,
  });
  assert.ok(res.score >= 70 && res.score <= 95);
  assert.equal(res.breakdown.sleep, 88);
});

test('generates 8 modular routines and 3 phases respecting under-18 safety', () => {
  const answers: QuizAnswers = {
    ageRange: 'under-18',
    genderIdentity: 'Male',
    goals: ['Clearer skin', 'Posture & mobility', 'Confidence & presence'],
    skinType: 'Sensitive',
    hairType: 'Wavy',
    fitnessExperience: 'Beginner',
    budget: 'Budget ($0–$30/mo)',
    minutesPerDay: 30,
    gymAccess: 'Home / Bodyweight',
    sleepHours: '7–8h',
    dietPreference: 'Balanced omnivore',
    sensitivities: 'Fragrance sensitivity',
    medicalConditions: '',
    culturalPreferences: '',
    currentSkincare: 'Water rinse',
    currentGrooming: 'Basic trim',
    stylePreference: 'Minimalist',
    photoConsent: false,
  };

  const bp = generateBlueprint(answers);
  assert.equal(bp.phases.length, 3);
  assert.equal(bp.routines.length, 8);
  const skincare = bp.routines.find((r) => r.domain === 'Skincare');
  assert.ok(skincare?.safetyNote.includes('Avoid harsh acids'));
  assert.ok(generateDefaultDailyTasks(bp).length >= 5);
});
