'use client';
import React, { useState, useEffect } from 'react';
import styles from './update-profile-modal.module.css';
import { IconX } from '@tabler/icons-react';
import { useUser } from '@/context/userContext';
import {
  profileUpdated,
  error as showError,
} from '../common/notification-service';

export default function UpdateProfileModal({
  isOpen,
  onClose,
  studentId: propStudentId,
  onUpdateSuccess,
}) {
  const { user, loading: userLoading } = useUser();

  let idFromContext = null;
  if (user && user.role === 'student' && user.id && user.id !== 'unknown') {
    idFromContext = user.id;
  }
  const studentId = idFromContext || propStudentId;

  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [batch, setBatch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBranch('');
      setCgpa('');
      setBatch('');
      setIsLoading(false);

      // Load existing data if available
      if (!userLoading && user && user.role === 'student' && studentId) {
        fetchStudentData();
      }
    }
  }, [isOpen, user, userLoading, studentId]);

  const fetchStudentData = async () => {
    if (!studentId) {
      return;
    }

    try {
      const response = await fetch(`/api/students?id=${studentId}`);

      if (response.ok) {
        const data = await response.json();

        setBranch(data.branch || '');
        setCgpa(data.cgpa?.toString() || '');

        let extractedBatch = '';
        if (data.identifier) {
          const yearMatch = data.identifier.match(/^(\d{4})/);
          if (yearMatch) {
            extractedBatch = yearMatch[1];
          }
        }
        setBatch(extractedBatch || '');
      } else {
        const errorData = await response.json();
        console.error('Error fetching student data:', errorData);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branch || !cgpa || !batch) {
      showError('All fields are required.');
      return;
    }

    if (!studentId) {
      showError('Student ID not found. Cannot update profile.');
      console.error('Update Error: studentId is missing.');
      return;
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      showError('Please enter a valid CGPA between 0 and 10.');
      return;
    }

    if (!/^\d{4}$/.test(batch)) {
      showError('Please enter a valid 4-digit batch year.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/students', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentid: studentId,
          branch: branch.toUpperCase(),
          cgpa: parsedCgpa,
          batch: parseInt(batch, 10),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      profileUpdated('Student profile');
      if (onUpdateSuccess) {
        onUpdateSuccess({
          branch: branch.toUpperCase(),
          cgpa: parsedCgpa,
          batch: parseInt(batch, 10),
        });
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      showError(err.message || 'An unexpected error occurred.');
      console.error('Update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label='Close modal'
        >
          <IconX size={24} />
        </button>
        <h2>Update Your Profile</h2>
        <p className={styles.instructions}>
          Enter your current academic details. This helps connect you with the
          right resources.
        </p>
        {/* Show loading indicator inside form if user data is still loading */}
        {userLoading && <p>Loading current data...</p>}

        {/* Disable form while user data is loading initially */}
        <form onSubmit={handleSubmit}>
          <fieldset style={{ border: 'none' }} disabled={userLoading}>
            <div className={styles.formGroup}>
              <label htmlFor='batch'>Batch (Year, e.g., 2023)</label>
              <input
                type='text'
                id='batch'
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder='YYYY'
                required
                maxLength={4}
                pattern='\d{4}'
                inputMode='numeric'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='branch'>Branch Code (e.g., A7, B4A7)</label>
              <input
                type='text'
                id='branch'
                value={branch}
                onChange={(e) => setBranch(e.target.value.toUpperCase())}
                placeholder='e.g., A7 or B4A7'
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='cgpa'>Current CGPA</label>
              <input
                type='number'
                id='cgpa'
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder='e.g., 8.75'
                required
                step='0.01'
                min='0'
                max='10'
              />
            </div>
          </fieldset>

          <button
            type='submit'
            disabled={isLoading || userLoading}
            className={styles.submitButton}
            aria-label='Submit profile update'
          >
            {isLoading
              ? 'Updating...'
              : userLoading
              ? 'Loading Data...'
              : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
