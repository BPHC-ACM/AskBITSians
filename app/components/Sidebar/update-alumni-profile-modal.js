'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './update-profile-modal.module.css';
import { IconX } from '@tabler/icons-react';
import { useUser } from '@/context/userContext';
import {
  profileUpdated,
  error as showError,
} from '../common/notification-service';

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
    role: '',
    domain: '',
    graduation_year: '',
    linkedin_profile_url: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [domainOptions, setDomainOptions] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        company: '',
        role: '',
        domain: '',
        graduation_year: '',
        linkedin_profile_url: '',
      });
      setIsLoading(false);

      // Fetch categories when modal opens
      fetchCategories();

      // Load existing data if available
      if (!userLoading && user && user.role === 'alumnus') {
        // Fetch current alumni data to populate form
        fetchAlumniData();
      }
    }
  }, [isOpen, user, userLoading]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setRoleOptions(data.roles || []);
        setDomainOptions(data.domains || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to load role and domain options.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

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
            role: alumni.role || '',
            domain: alumni.domain || '',
            graduation_year: alumni.graduation_year?.toString() || '',
            linkedin_profile_url: alumni.linkedin_profile_url || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company || !formData.role || !formData.domain) {
      showError('Company, Role, and Domain are required.');
      return;
    }

    if (!alumniId) {
      showError('Alumni ID not found. Cannot update profile.');
      console.error('Update Error: alumniId is missing.');
      return;
    }

    if (formData.graduation_year && !/^\d{4}$/.test(formData.graduation_year)) {
      showError('Please enter a valid 4-digit graduation year.');
      return;
    }

    if (
      formData.linkedin_profile_url &&
      !formData.linkedin_profile_url.includes('linkedin.com')
    ) {
      showError('Please enter a valid LinkedIn URL.');
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        id: alumniId,
        company: formData.company,
        role: formData.role,
        domain: formData.domain,
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

      profileUpdated('Alumni profile');
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
        <h2>Update Your Alumni Profile</h2>
        <p className={styles.instructions}>
          Complete your profile to help students connect with you for guidance
          and support.
        </p>

        {userLoading && <p>Loading current data...</p>}

        <form onSubmit={handleSubmit}>
          <fieldset
            style={{ border: 'none' }}
            disabled={userLoading || isLoadingCategories}
          >
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
              <label htmlFor='role'>Role *</label>
              <select
                id='role'
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                required
                disabled={isLoadingCategories}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  backgroundColor: '#333',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                <option value=''>
                  {isLoadingCategories
                    ? 'Loading roles...'
                    : 'Select your role...'}
                </option>
                {roleOptions.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='domain'>Domain *</label>
              <select
                id='domain'
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                required
                disabled={isLoadingCategories}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  backgroundColor: '#333',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                <option value=''>
                  {isLoadingCategories
                    ? 'Loading domains...'
                    : 'Select your domain...'}
                </option>
                {domainOptions.map((domain, index) => (
                  <option key={index} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
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
          </fieldset>

          <button
            type='submit'
            disabled={isLoading || userLoading || isLoadingCategories}
            className={styles.submitButton}
            aria-label='Submit alumni profile update'
          >
            {isLoading
              ? 'Updating...'
              : userLoading || isLoadingCategories
              ? 'Loading Data...'
              : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
