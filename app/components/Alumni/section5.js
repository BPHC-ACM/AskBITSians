import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

const FilterSection = ({
  initialSearchTerm,
  onSearchTermChange,
  groupBy,
  onGroupByChange,
  filterRole,
  onFilterRoleChange,
  filterDomain,
  onFilterDomainChange,
  filterCompany,
  onFilterCompanyChange,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
  availableFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const [internalSearchInput, setInternalSearchInput] =
    useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(internalSearchInput, 500);

  useEffect(() => {
    onSearchTermChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchTermChange]);

  useEffect(() => {
    if (initialSearchTerm !== internalSearchInput) {
      setInternalSearchInput(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  useEffect(() => {
    const handleResize = () => {
      setShowFilters(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.filterSection}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <IconSearch size={20} className={styles.searchIcon} />
          <input
            type='search'
            placeholder='Search by name, company, role, or domain...'
            value={internalSearchInput}
            onChange={(e) => setInternalSearchInput(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.mobileFilterToggle}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterToggleButton}
          aria-label='Toggle filters'
        >
          <IconFilter size={18} />
          Filters & Sort
          {showFilters ? (
            <IconChevronUp size={18} />
          ) : (
            <IconChevronDown size={18} />
          )}
        </button>
      </div>
      <motion.div
        className={`${styles.filtersRow} ${
          showFilters ? styles.filtersVisible : styles.filtersHidden
        }`}
        initial={false}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <div className={styles.filterGroup}>
          <CustomSelect
            value={groupBy}
            onValueChange={onGroupByChange}
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
            onValueChange={onFilterRoleChange}
            options={[
              { value: 'all', label: 'All Roles' },
              ...(availableFilters.roles || []).map((role) => ({
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
            onValueChange={onFilterDomainChange}
            options={[
              { value: 'all', label: 'All Domains' },
              ...(availableFilters.domains || []).map((domain) => ({
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
            onValueChange={onFilterCompanyChange}
            options={[
              { value: 'all', label: 'All Companies' },
              ...(availableFilters.companies || []).map((company) => ({
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
              onClick={() => onSortChange('name')}
              className={`${styles.sortButton} ${
                sortBy === 'name' ? styles.active : ''
              }`}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => onSortChange('graduation_year')}
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
        <button onClick={onResetFilters} className={styles.resetButton}>
          Reset Filters
        </button>
      </motion.div>
    </div>
  );
};

export default function Section5() {
  const [searchTerm, setSearchTerm] = useState('');
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('role');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [availableFilters, setAvailableFilters] = useState({
    roles: [],
    domains: [],
    companies: [],
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      console.log(`🚀 API Call: Fetching with search="${searchTerm}"`);

      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterRole !== 'all') params.append('role', filterRole);
        if (filterDomain !== 'all') params.append('domain', filterDomain);
        if (filterCompany !== 'all') params.append('company', filterCompany);
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);

        const response = await fetch(
          `/api/alumni/showcase?${params.toString()}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        setAlumniData(data.alumni || []);

        if (data.filters) {
          setAvailableFilters({
            roles: data.filters.roles || [],
            domains: data.filters.domains || [],
            companies: data.filters.companies || [],
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching alumni:', err);
          setError(
            'Failed to load alumni information. Please try again later.'
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [
    searchTerm,
    filterRole,
    filterDomain,
    filterCompany,
    sortBy,
    sortOrder,
    retryCount,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const triggerRetry = () => {
    setRetryCount((c) => c + 1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterDomain('all');
    setFilterCompany('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const handleSearchTermChange = useCallback((newTerm) => {
    setSearchTerm(newTerm);
  }, []);

  const groupedAlumni = useMemo(() => {
    if (!alumniData || !alumniData.length) return {};
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
        groups[groupKey] = { label: groupLabel, alumni: [] };
      }
      groups[groupKey].alumni.push(alumni);
    });

    const sortedGroups = {};
    const otherGroups = {};
    Object.keys(groups)
      .sort()
      .forEach((key) => {
        const sortedAlumni = groups[key].alumni.sort((a, b) => {
          const aHasLinkedIn = !!a.linkedin_profile_url;
          const bHasLinkedIn = !!b.linkedin_profile_url;
          if (aHasLinkedIn && !bHasLinkedIn) return -1;
          if (!aHasLinkedIn && bHasLinkedIn) return 1;
          return a.name.localeCompare(b.name);
        });
        const groupWithSortedAlumni = { ...groups[key], alumni: sortedAlumni };
        if (key === 'Other' || key === 'Unknown') {
          otherGroups[key] = groupWithSortedAlumni;
        } else {
          sortedGroups[key] = groupWithSortedAlumni;
        }
      });

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

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const groupVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const AlumniContent = () => (
    <AnimatePresence mode='wait'>
      {!loading && Object.keys(groupedAlumni).length > 0 ? (
        <motion.div
          key={`alumni-groups-${Object.keys(groupedAlumni).join('-')}`}
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
        !loading && (
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
        )
      )}
    </AnimatePresence>
  );

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

          <FilterSection
            initialSearchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            filterRole={filterRole}
            onFilterRoleChange={setFilterRole}
            filterDomain={filterDomain}
            onFilterDomainChange={setFilterDomain}
            filterCompany={filterCompany}
            onFilterCompanyChange={setFilterCompany}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onResetFilters={resetFilters}
            availableFilters={availableFilters}
          />

          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <IconUsers size={20} />
              <span>{alumniData.length} Alumni</span>
            </div>
            <div className={styles.statItem}>
              <IconBuilding size={20} />
              <span>{(availableFilters.companies || []).length} Companies</span>
            </div>
            <div className={styles.statItem}>
              <IconBriefcase size={20} />
              <span>{(availableFilters.roles || []).length} Roles</span>
            </div>
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.loadingContainer}
            >
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>
                Loading our amazing alumni...
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.errorContainer}
            >
              <p className={styles.errorText}>{error}</p>
              <button onClick={triggerRetry} className={styles.retryButton}>
                Try Again
              </button>
            </motion.div>
          )}

          {!error && <AlumniContent />}
        </motion.div>
      }
    />
  );
}
