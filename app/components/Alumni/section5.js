import React, { useState, useEffect, useCallback } from 'react';
import Section from '../section';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSearch,
  IconFilter,
  IconSortAscendingShapes,
  IconUsers,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconMapPin,
  IconBrandLinkedin,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import CustomSelect from '../common/CustomSelect';
import styles from './section5.module.css';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Section5() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Separate state for input
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('role'); // 'role', 'domain', 'company', 'graduation_year'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'graduation_year', 'company'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [filterRole, setFilterRole] = useState('all');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
  const [availableFilters, setAvailableFilters] = useState({
    roles: [],
    domains: [],
    companies: [],
  });

  // Debounce search input with 500ms delay
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Update searchTerm when debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Initialize showFilters based on screen size
  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth > 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);
      if (filterDomain !== 'all') params.append('domain', filterDomain);
      if (filterCompany !== 'all') params.append('company', filterCompany);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/alumni/showcase?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setAlumniData(data.alumni || []);
      setAvailableFilters({
        roles: data.filters?.roles || [],
        domains: data.filters?.domains || [],
        companies: data.filters?.companies || [],
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching alumni:', err);
      setError('Failed to load alumni information. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterRole, filterDomain, filterCompany, sortBy, sortOrder]);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value); // Update input immediately for UI responsiveness
  };

  const handleGroupByChange = (value) => {
    setGroupBy(value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchInput(''); // Reset input state as well
    setSearchTerm('');
    setFilterRole('all');
    setFilterDomain('all');
    setFilterCompany('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Group alumni based on selected groupBy field
  const groupedAlumni = React.useMemo(() => {
    if (!alumniData.length) return {};

    const groups = {};

    alumniData.forEach((alumni) => {
      let groupKey;
      let groupLabel;

      switch (groupBy) {
        case 'role':
          groupKey = alumni.role || 'Other';
          groupLabel = alumni.role || 'Other Roles';
          break;
        case 'domain':
          groupKey = alumni.domain || 'Other';
          groupLabel = alumni.domain || 'Other Domains';
          break;
        case 'company':
          groupKey = alumni.company || 'Other';
          groupLabel = alumni.company || 'Other Companies';
          break;
        case 'graduation_year':
          groupKey = alumni.graduation_year || 'Unknown';
          groupLabel = alumni.graduation_year
            ? `Class of ${alumni.graduation_year}`
            : 'Year Unknown';
          break;
        default:
          groupKey = 'all';
          groupLabel = 'All Alumni';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          label: groupLabel,
          alumni: [],
        };
      }
      groups[groupKey].alumni.push(alumni);
    });

    // Sort groups by key, but always put "Other" related groups at the end
    const sortedGroups = {};
    const otherGroups = {};

    Object.keys(groups)
      .sort()
      .forEach((key) => {
        // Sort alumni within each group: LinkedIn profiles first, then others
        const sortedAlumni = groups[key].alumni.sort((a, b) => {
          // Primary sort: LinkedIn URL availability (profiles with LinkedIn first)
          const aHasLinkedIn = !!a.linkedin_profile_url;
          const bHasLinkedIn = !!b.linkedin_profile_url;

          if (aHasLinkedIn && !bHasLinkedIn) return -1;
          if (!aHasLinkedIn && bHasLinkedIn) return 1;

          // Secondary sort: alphabetical by name within each LinkedIn group
          return a.name.localeCompare(b.name);
        });

        const groupWithSortedAlumni = {
          ...groups[key],
          alumni: sortedAlumni,
        };

        if (key === 'Other' || key === 'Unknown') {
          otherGroups[key] = groupWithSortedAlumni;
        } else {
          sortedGroups[key] = groupWithSortedAlumni;
        }
      });

    // Add "Other" groups at the end
    Object.keys(otherGroups).forEach((key) => {
      sortedGroups[key] = otherGroups[key];
    });

    return sortedGroups;
  }, [alumniData, groupBy]);

  const AlumniCard = ({ alumni }) => (
    <motion.div
      className={styles.alumniCard}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.cardHeader}>
        <img
          src={`/api/avatar?name=${encodeURIComponent(alumni.name)}`}
          alt={`${alumni.name} Avatar`}
          className={styles.avatar}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className={styles.nameSection}>
          <h3 className={styles.alumniName}>{alumni.name}</h3>
          {alumni.graduation_year && (
            <div className={styles.graduationYear}>
              <IconCalendar size={14} />
              <span>Class of {alumni.graduation_year}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        {alumni.role && (
          <div className={styles.infoItem}>
            <IconBriefcase size={16} className={styles.infoIcon} />
            <span className={styles.infoLabel}>Role:</span>
            <span className={styles.infoValue}>{alumni.role}</span>
          </div>
        )}

        {alumni.company && (
          <div className={styles.infoItem}>
            <IconBuilding size={16} className={styles.infoIcon} />
            <span className={styles.infoLabel}>Company:</span>
            <span className={styles.infoValue}>{alumni.company}</span>
          </div>
        )}

        {alumni.domain && (
          <div className={styles.infoItem}>
            <IconMapPin size={16} className={styles.infoIcon} />
            <span className={styles.infoLabel}>Domain:</span>
            <span className={styles.infoValue}>{alumni.domain}</span>
          </div>
        )}

        {alumni.linkedin_profile_url && (
          <div className={styles.cardFooter}>
            <a
              href={alumni.linkedin_profile_url}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.linkedinLink}
            >
              <IconBrandLinkedin size={16} />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );

  const FilterSection = () => (
    <div className={styles.filterSection}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <IconSearch size={20} className={styles.searchIcon} />
          <input
            type='search'
            placeholder='Search by name, company, role, or domain...'
            value={searchInput}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className={styles.mobileFilterToggle}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterToggleButton}
          aria-label="Toggle filters"
        >
          <IconFilter size={18} />
          Filters & Sort
          {showFilters ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        </button>
      </div>

      <motion.div 
        className={`${styles.filtersRow} ${showFilters ? styles.filtersVisible : styles.filtersHidden}`}
        initial={false}
        animate={{
          height: showFilters ? "auto" : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        style={{
          overflow: "hidden"
        }}
      >
        <div className={styles.filterGroup}>
          <CustomSelect
            value={groupBy}
            onValueChange={handleGroupByChange}
            options={[
              { value: 'role', label: 'Role' },
              { value: 'domain', label: 'Domain' },
              { value: 'company', label: 'Company' },
              { value: 'graduation_year', label: 'Graduation Year' },
            ]}
            placeholder='Group by...'
            label='Group By:'
            icon={IconUsers}
            aria-label='Group alumni by'
          />
        </div>

        <div className={styles.filterGroup}>
          <CustomSelect
            value={filterRole}
            onValueChange={setFilterRole}
            options={[
              { value: 'all', label: 'All Roles' },
              ...availableFilters.roles.map((role) => ({
                value: role,
                label: role,
              })),
            ]}
            placeholder='Filter by role...'
            label='Role:'
            icon={IconFilter}
            aria-label='Filter by role'
          />
        </div>

        <div className={styles.filterGroup}>
          <CustomSelect
            value={filterDomain}
            onValueChange={setFilterDomain}
            options={[
              { value: 'all', label: 'All Domains' },
              ...availableFilters.domains.map((domain) => ({
                value: domain,
                label: domain,
              })),
            ]}
            placeholder='Filter by domain...'
            label='Domain:'
            icon={IconFilter}
            aria-label='Filter by domain'
          />
        </div>

        <div className={styles.filterGroup}>
          <CustomSelect
            value={filterCompany}
            onValueChange={setFilterCompany}
            options={[
              { value: 'all', label: 'All Companies' },
              ...availableFilters.companies.map((company) => ({
                value: company,
                label: company,
              })),
            ]}
            placeholder='Filter by company...'
            label='Company:'
            icon={IconFilter}
            aria-label='Filter by company'
          />
        </div>

        <div className={styles.sortGroup}>
          <label className={styles.filterLabel}>
            <IconSortAscendingShapes size={16} />
            Sort:
          </label>
          <div className={styles.sortButtons}>
            <button
              onClick={() => handleSortChange('name')}
              className={`${styles.sortButton} ${
                sortBy === 'name' ? styles.active : ''
              }`}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('graduation_year')}
              className={`${styles.sortButton} ${
                sortBy === 'graduation_year' ? styles.active : ''
              }`}
            >
              Year{' '}
              {sortBy === 'graduation_year' &&
                (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        <button onClick={resetFilters} className={styles.resetButton}>
          Reset Filters
        </button>
      </motion.div>
    </div>
  );

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const AlumniContent = () => (
    <AnimatePresence mode='wait'>
      {Object.keys(groupedAlumni).length > 0 ? (
        <motion.div
          key={`alumni-groups-${searchTerm}-${filterRole}-${filterDomain}-${filterCompany}-${sortBy}-${sortOrder}-${groupBy}`}
          variants={groupVariants}
          initial='hidden'
          animate='visible'
          exit={{ opacity: 0 }}
          className={styles.groupsContainer}
        >
          {Object.entries(groupedAlumni).map(([groupKey, group]) => (
            <motion.div
              key={groupKey}
              variants={cardVariants}
              className={styles.alumniGroup}
            >
              <div className={styles.groupHeader}>
                <h3 className={styles.groupTitle}>
                  {group.label}
                  <span className={styles.groupCount}>
                    ({group.alumni.length}{' '}
                    {group.alumni.length === 1 ? 'alumnus' : 'alumni'})
                  </span>
                </h3>
              </div>

              <motion.div
                variants={gridContainerVariants}
                initial='hidden'
                animate='visible'
                className={styles.alumniGrid}
              >
                {group.alumni.map((alumni) => (
                  <motion.div key={alumni.id} variants={cardVariants}>
                    <AlumniCard alumni={alumni} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key='no-results'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={styles.noResultsContainer}
        >
          <IconUsers size={48} className={styles.noResultsIcon} />
          <h3 className={styles.noResultsTitle}>No Alumni Found</h3>
          <p className={styles.noResultsText}>
            Try adjusting your filters or search terms to find alumni.
          </p>
          <button onClick={resetFilters} className={styles.resetButton}>
            Clear All Filters
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  const groupVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  if (loading) {
    return (
      <Section
        title='Our Alumni Network'
        content={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.loadingContainer}
          >
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Loading our amazing alumni...</p>
          </motion.div>
        }
      />
    );
  }

  if (error || !alumniData || alumniData.length === 0) {
    return (
      <Section
        title='Our Alumni Network'
        content={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.errorContainer}
          >
            <p className={styles.errorText}>
              {error || 'No alumni information available at the moment.'}
            </p>
            <button onClick={fetchAlumni} className={styles.retryButton}>
              Try Again
            </button>
          </motion.div>
        }
      />
    );
  }

  return (
    <Section
      title='Our Alumni Network'
      content={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.showcaseContainer}
        >
          <div className={styles.showcaseHeader}>
            <h2 className={styles.showcaseTitle}>
              Meet Our Distinguished Alumni
            </h2>
            <p className={styles.showcaseDescription}>
              Discover the incredible achievements of BITS Pilani graduates
              working at leading companies worldwide. Connect with alumni who
              can guide your career journey and share valuable insights from
              their professional experience.
            </p>
          </div>

          <FilterSection />

          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <IconUsers size={20} />
              <span>{alumniData.length} Alumni</span>
            </div>
            <div className={styles.statItem}>
              <IconBuilding size={20} />
              <span>{availableFilters.companies.length} Companies</span>
            </div>
            <div className={styles.statItem}>
              <IconBriefcase size={20} />
              <span>{availableFilters.roles.length} Roles</span>
            </div>
          </div>

          <AlumniContent />
        </motion.div>
      }
    />
  );
}
