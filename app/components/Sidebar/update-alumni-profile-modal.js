'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './update-profile-modal.module.css';
import { IconX, IconPlus } from '@tabler/icons-react';
import { useUser } from '@/context/userContext';

const DOMAIN_OPTIONS = [
  'Technology',
  'Software Engineering',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Cybersecurity',
  'Product Management',
  'Design',
  'Finance',
  'Investment Banking',
  'Consulting',
  'Marketing',
  'Sales',
  'Operations',
  'Research',
  'Academia',
  'Entrepreneurship',
  'Healthcare',
  'Legal',
  'Government',
  'Non-Profit',
  'Media',
  'Entertainment',
  'Other',
];

export default function UpdateAlumniProfileModal({
  isOpen,
  onClose,
  alumniId: propAlumniId,
  onUpdateSuccess,
}) {
  const { user, loading: userLoading, refetchUser } = useUser();
  let idFromContext = null;
  if (user && user.role === 'alumnus' && user.id && user.id !== 'unknown') {
    idFromContext = user.id;
  }
  const alumniId = idFromContext || propAlumniId;

  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    graduation_year: '',
    linkedin_profile_url: '',
    areas_of_expertise: [],
  });
  const [newExpertise, setNewExpertise] = useState('');
  const [showCustomExpertise, setShowCustomExpertise] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        company: '',
        job_title: '',
        graduation_year: '',
        linkedin_profile_url: '',
        areas_of_expertise: [],
      });
      setError(null);
      setSuccess(null);
      setIsLoading(false);
      setNewExpertise('');
      setShowCustomExpertise(false);

      // Load existing data if available
      if (!userLoading && user && user.role === 'alumnus') {
        // Fetch current alumni data to populate form
        fetchAlumniData();
      }
    }
  }, [isOpen, user, userLoading]);

  const fetchAlumniData = async () => {
    if (!alumniId) return;

    try {
      const response = await fetch(`/api/alumni?id=${alumniId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const alumni = data[0];
          setFormData({
            company: alumni.company || '',
            job_title: alumni.job_title || '',
            graduation_year: alumni.graduation_year?.toString() || '',
            linkedin_profile_url: alumni.linkedin_profile_url || '',
            areas_of_expertise: alumni.areas_of_expertise || [],
          });
        }
      }
    } catch (error) {
      console.error('Error fetching alumni data:', error);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addExpertise = (expertise) => {
    if (expertise && !formData.areas_of_expertise.includes(expertise)) {
      setFormData((prev) => ({
        ...prev,
        areas_of_expertise: [...prev.areas_of_expertise, expertise],
      }));
    }
    setNewExpertise('');
    setShowCustomExpertise(false);
  };

  const removeExpertise = (expertiseToRemove) => {
    setFormData((prev) => ({
      ...prev,
      areas_of_expertise: prev.areas_of_expertise.filter(
        (exp) => exp !== expertiseToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.company || !formData.job_title) {
      setError('Company and Job Title are required.');
      return;
    }

    if (!alumniId) {
      setError('Alumni ID not found. Cannot update profile.');
      console.error('Update Error: alumniId is missing.');
      return;
    }

    if (formData.graduation_year && !/^\d{4}$/.test(formData.graduation_year)) {
      setError('Please enter a valid 4-digit graduation year.');
      return;
    }

    if (
      formData.linkedin_profile_url &&
      !formData.linkedin_profile_url.includes('linkedin.com')
    ) {
      setError('Please enter a valid LinkedIn URL.');
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        id: alumniId,
        company: formData.company,
        job_title: formData.job_title,
        areas_of_expertise: formData.areas_of_expertise,
      };

      if (formData.graduation_year) {
        updateData.graduation_year = parseInt(formData.graduation_year, 10);
      }

      if (formData.linkedin_profile_url) {
        updateData.linkedin_profile_url = formData.linkedin_profile_url;
      }

      const response = await fetch('/api/alumni', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      setSuccess('Profile updated successfully!');
      if (onUpdateSuccess) {
        onUpdateSuccess(updateData);
      }

      // Refresh user context
      if (refetchUser) {
        setTimeout(() => {
          refetchUser();
        }, 500);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <IconX size={24} />
        </button>
        <h2>Update Your Alumni Profile</h2>
        <p className={styles.instructions}>
          Complete your profile to help students connect with you for guidance
          and support.
        </p>

        {userLoading && <p>Loading current data...</p>}

        <form onSubmit={handleSubmit}>
          <fieldset style={{ border: 'none' }} disabled={userLoading}>
            <div className={styles.formGroup}>
              <label htmlFor='company'>Company *</label>
              <input
                type='text'
                id='company'
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder='e.g., Google, Microsoft, Goldman Sachs'
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='job_title'>Job Title *</label>
              <input
                type='text'
                id='job_title'
                value={formData.job_title}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
                placeholder='e.g., Software Engineer, Product Manager'
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='graduation_year'>Graduation Year</label>
              <input
                type='text'
                id='graduation_year'
                value={formData.graduation_year}
                onChange={(e) =>
                  handleInputChange('graduation_year', e.target.value)
                }
                placeholder='YYYY (e.g., 2018)'
                maxLength={4}
                pattern='\d{4}'
                inputMode='numeric'
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='linkedin_profile_url'>LinkedIn Profile URL</label>
              <input
                type='url'
                id='linkedin_profile_url'
                value={formData.linkedin_profile_url}
                onChange={(e) =>
                  handleInputChange('linkedin_profile_url', e.target.value)
                }
                placeholder='https://linkedin.com/in/yourprofile'
              />
            </div>

            <div className={styles.formGroup}>
              <label>Areas of Expertise</label>

              {/* Selected expertise tags */}
              {formData.areas_of_expertise.length > 0 && (
                <div
                  style={{
                    marginBottom: '0.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  {formData.areas_of_expertise.map((expertise, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {expertise}
                      <button
                        type='button'
                        onClick={() => removeExpertise(expertise)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          padding: '0',
                          marginLeft: '0.25rem',
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Predefined options */}
              <div style={{ marginBottom: '0.5rem' }}>
                <select
                  value=''
                  onChange={(e) => {
                    if (e.target.value) {
                      addExpertise(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    backgroundColor: '#333',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value=''>Select an area of expertise...</option>
                  {DOMAIN_OPTIONS.filter(
                    (option) => !formData.areas_of_expertise.includes(option)
                  ).map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom expertise input */}
              {!showCustomExpertise ? (
                <button
                  type='button'
                  onClick={() => setShowCustomExpertise(true)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px dashed #666',
                    color: '#ccc',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <IconPlus size={16} />
                  Add custom expertise
                </button>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type='text'
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder='Enter custom expertise...'
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #444',
                      borderRadius: '6px',
                      backgroundColor: '#333',
                      color: '#fff',
                      fontSize: '0.9rem',
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExpertise(newExpertise);
                      }
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => addExpertise(newExpertise)}
                    style={{
                      backgroundColor: '#3b82f6',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Add
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowCustomExpertise(false);
                      setNewExpertise('');
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #666',
                      color: '#ccc',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </fieldset>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}

          <button
            type='submit'
            disabled={isLoading || userLoading}
            className={styles.submitButton}
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
