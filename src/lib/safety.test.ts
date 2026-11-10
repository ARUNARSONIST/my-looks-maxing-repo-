import test from 'node:test';
import assert from 'node:assert/strict';
import { assessSafetyQuery, isMinorDob, sanitizeCommunityPost } from './safety';
import { checkPasswordStrength, validateAgeConfirmation, validateEmailFormat } from './authValidation';

test('blocks unsafe practices like bonesmashing, steroids, and extreme fasting', () => {
  const bone = assessSafetyQuery('How do I do bonesmashing for jawline?');
  assert.equal(bone.classification, 'unsafe_practice');
  assert.equal(bone.allowProceed, false);

  const steroids = assessSafetyQuery('Best SARMs or steroid cycle for lean gains');
  assert.equal(steroids.classification, 'unsafe_practice');
  assert.equal(steroids.allowProceed, false);

  const fasting = assessSafetyQuery('Should I try extreme fasting at 500 kcal?');
  assert.equal(fasting.classification, 'unsafe_practice');
  assert.equal(fasting.allowProceed, false);
});

test('redirects medical skin, hair-loss, and cosmetic procedure queries to professionals', () => {
  const acne = assessSafetyQuery('What should I take for severe cystic acne and scarring?');
  assert.equal(acne.classification, 'medical_boundary');
  assert.equal(acne.allowProceed, false);

  const hair = assessSafetyQuery('Should I start finasteride for hair loss?');
  assert.equal(hair.classification, 'medical_boundary');
  assert.equal(hair.allowProceed, false);
});

test('allows safe grooming, style, and posture questions', () => {
  const safe = assessSafetyQuery('What haircut and skincare cleanser fit oily skin and wavy hair?');
  assert.equal(safe.classification, 'safe');
  assert.equal(safe.allowProceed, true);
});

test('rejects rating or mogging language in community posts', () => {
  const badPost = sanitizeCommunityPost('Rate me 1-10', 'Am I mogging or is it over?');
  assert.equal(badPost.allowed, false);

  const goodPost = sanitizeCommunityPost('6-week skincare consistency update', 'Sticking to cleanser and SPF helped a lot.');
  assert.equal(goodPost.allowed, true);
  assert.equal(goodPost.flaggedForModeration, false);
});

test('under-18 DOB detection and auth validation behave accurately', () => {
  const ref = new Date('2026-11-09T00:00:00Z');
  assert.equal(isMinorDob('2010-05-15', ref), true);
  assert.equal(isMinorDob('2000-05-15', ref), false);
  assert.equal(validateEmailFormat('alex@apexglow.app'), true);
  assert.equal(validateEmailFormat('not-an-email'), false);
  assert.equal(checkPasswordStrength('GlowPass2026!').valid, true);
  assert.equal(checkPasswordStrength('weak').valid, false);
  assert.equal(validateAgeConfirmation('2016-01-01', ref).valid, false);
  assert.equal(validateAgeConfirmation('2010-01-01', ref).isUnder18, true);
});
