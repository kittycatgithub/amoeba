import React, { useRef, useState, useMemo, useEffect } from 'react'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getPropertyApi, updatePropertyApi } from '../api/propertyApi'
import { motion } from "framer-motion";

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Noida', 'Nagpur',
  'Gurugram', 'Indore', 'Bhopal', 'Surat',
]

const PROPERTY_TYPES_MAP: Record<string, string[]> = {
  Buy: [
    'Residential Apartment', 'Independent House/Villa', 'Builder Floor',
    '1 RK / Studio Apartment',
  ],
  Rent: [
    'Residential Apartment', 'Independent House/Villa', 'Builder Floor',
    '1 RK / Studio Apartment',
  ],
  Commercial: [
    'Commercial Office', 'Commercial Shop', 'Commercial Showroom',
    'Warehouse / Godown', 'Industrial Building', 'Commercial Land',
  ],
  'Plots & Land': [
    'Residential Land / Plot', 'Agricultural Land', 'Commercial Land',
    'Industrial Land', 'Farm House',
  ],
  Projects: [
    'Residential Apartment', 'Independent House/Villa', 'Builder Floor',
    'Township', 'Commercial Office', 'Commercial Shop', 'Mixed Use Project',
  ],
  'New Launch': [
    'Residential Apartment', 'Independent House/Villa', 'Builder Floor',
    '1 RK / Studio Apartment', 'Commercial Office', 'Commercial Shop',
  ],
}

const AMENITIES_LIST = [
  'Parking', 'Lift', 'Power Backup', 'Swimming Pool', 'Gymnasium',
  'Park / Garden', 'WiFi / Internet', 'AC', 'CCTV Security', 'Club House',
  'Intercom', 'Fire Safety', 'Rainwater Harvesting', 'Visitor Parking',
  'Gated Community', 'Bathroom'
]

const ROLES = ['Owner', 'Company', 'Agent', 'Dealer', 'Builder']

interface FormState {
  role: string
  category: string
  propertyType: string
  title: string
  city: string
  locality: string
  address: string
  bedrooms: string
  bathrooms: string
  area: string
  furnishing: string
  priceValue: string
  priceUnit: string
  availability: string
  availableFor: string[]
  amenities: string[]
  description: string
  builderName: string
  projectStatus: string
  reraNumber: string
  launchDate: string
}

const initialForm: FormState = {
  role: '',
  category: 'Buy',
  propertyType: '',
  title: '',
  city: '',
  locality: '',
  address: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  furnishing: '',
  price: '',
  priceUnit: 'Lac',
  availability: '',
  availableFor: [],
  amenities: [],
  description: '',
  builderName: '',
  projectStatus: '',
  reraNumber: '',
  launchDate: '',
}

const CATEGORIES = ['Buy', 'Rent', 'Commercial', 'Plots & Land', 'Projects', 'New Launch']
const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished']
const AVAILABILITY_OPTIONS = ['Ready to Move', 'Within 6 Months', 'Within 1 Year', 'More Than 1 Year']
const AVAILABLE_FOR_OPTIONS = ['Family', 'Single Men', 'Single Women', 'Company Lease']
const PROJECT_STATUS_OPTIONS = ['Pre-Launch', 'Under Construction', 'Ready to Move', 'Completed']

const NO_ROOMS_CATS = new Set(['Commercial', 'Plots & Land'])
const NO_FURNISHING_CATS = new Set(['Commercial', 'Plots & Land'])
const NO_AVAIL_FOR_CATS = new Set(['Commercial', 'Plots & Land', 'Projects', 'New Launch'])
const PROJECT_CATS = new Set(['Projects', 'New Launch'])

const PRICE_UNITS: Record<string, string[]> = {
  Buy: ['Lac', 'Cr'],
  Rent: ['₹/mo', '₹/sq ft'],
  Commercial: ['Lac', 'Cr', '₹/mo', '₹/sq ft'],
  'Plots & Land': ['Lac', 'Cr', '₹/sq ft'],
  Projects: ['Lac', 'Cr'],
  'New Launch': ['Lac', 'Cr'],
}

// Helper to parse price value from display string
const parsePriceValue = (priceStr: string): { value: string; unit: string } => {
  const lacMatch = priceStr.match(/^([\d.]+)\s*Lac/);
  const crMatch = priceStr.match(/^([\d.]+)\s*Cr/);
  const moMatch = priceStr.match(/^([\d.]+)K\/mo/);
  const sqftMatch = priceStr.match(/^₹([\d.]+)\/sqft/);

  if (lacMatch) return { value: lacMatch[1], unit: 'Lac' };
  if (crMatch) return { value: crMatch[1], unit: 'Cr' };
  if (moMatch) return { value: moMatch[1], unit: '₹/mo' };
  if (sqftMatch) return { value: sqftMatch[1], unit: '₹/sq ft' };
  return { value: '', unit: 'Lac' };
};

// Helper to parse area value
const parseAreaValue = (areaStr: string): string => {
  const match = areaStr.match(/^([\d.]+)/);
  return match ? match[1] : '';
};

const EditProperty = () => {
  const { id } = useParams<{ id: string }>()
  const { user, setShowUserLogin } = useAppContext()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initialForm)
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await getPropertyApi(id!)
        const prop = data.property
        console.log(prop, 'prop')

        // Parse price
        const { value: priceValue, unit: priceUnit } = parsePriceValue(prop.price)

        // Parse area
        const areaValue = parseAreaValue(prop.area)

        // Parse availableFor and amenities
        const availableFor = typeof prop.availableFor === 'string'
          ? JSON.parse(prop.availableFor || '[]')
          : prop.availableFor || []

        const amenities = typeof prop.amenities === 'string'
          ? JSON.parse(prop.amenities || '[]')
          : prop.amenities || []

        setForm({
          role: prop.postedBy || 'Owner',
          category: prop.category || 'Buy',
          propertyType: prop.type || '',
          title: prop.title || '',
          city: prop.city || '',
          locality: prop.location?.split(',')[0] || '',
          address: prop.address || '',
          bedrooms: String(prop.bedrooms || ''),
          bathrooms: String(prop.bathrooms || ''),
          area: areaValue,
          furnishing: prop.furnishing || '',
          priceValue: prop.priceValue,
          priceUnit: priceUnit,
          availability: prop.availability || '',
          availableFor: availableFor,
          amenities: amenities,
          description: prop.description || '',
          builderName: prop.builderName || '',
          projectStatus: prop.projectStatus || '',
          reraNumber: prop.reraNumber || '',
          launchDate: prop.launchDate || '',
        })

        setExistingImages(prop.images || [])
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch property:', error)
        toast.error('Failed to load property')
        navigate('/my-properties')
      }
    }

    if (id) fetchProperty()
  }, [id, navigate])

  const showRooms = !NO_ROOMS_CATS.has(form.category)
  const showFurnishing = !NO_FURNISHING_CATS.has(form.category)
  const showAvailFor = !NO_AVAIL_FOR_CATS.has(form.category)
  const showProjectInfo = PROJECT_CATS.has(form.category)

  const propertyTypes = useMemo(
    () => PROPERTY_TYPES_MAP[form.category] ?? [],
    [form.category]
  )

  const priceUnits = PRICE_UNITS[form.category] ?? ['Lac', 'Cr']

  const set = (field: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleCategoryChange = (cat: string) => {
    setForm(prev => ({
      ...prev,
      category: cat,
      propertyType: '',
      furnishing: '',
      bedrooms: '',
      bathrooms: '',
      availableFor: [],
      priceUnit: (PRICE_UNITS[cat] ?? ['Lac'])[0],
      builderName: '',
      projectStatus: '',
      reraNumber: '',
      launchDate: '',
    }))
    setErrors({})
  }

  const toggleMulti = (field: 'amenities' | 'availableFor', value: string) =>
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))

  const handleImages = (files: FileList | null) => {
    if (!files) return
    const maxAllowed = 6 - (existingImages.length - imagesToRemove.length) - images.length
    if (maxAllowed <= 0) {
      toast.error('Maximum 6 images allowed')
      return
    }
    const incoming = Array.from(files).slice(0, maxAllowed)
    const newPreviews = incoming.map(f => URL.createObjectURL(f))
    setImages(prev => [...prev, ...incoming])
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeNewImage = (idx: number) => {
    URL.revokeObjectURL(previews[idx])
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const removeExistingImage = (idx: number) => {
    setImagesToRemove(prev => [...prev, existingImages[idx]])
    setExistingImages(prev => prev.filter((_, i) => i !== idx))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.role) e.role = 'Please select your role'
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.propertyType) e.propertyType = 'Select a property type'
    if (!form.city) e.city = 'City is required'
    if (!form.locality.trim()) e.locality = 'Locality is required'
    if (!form.area || isNaN(Number(form.area)) || Number(form.area) <= 0)
      e.area = 'Enter valid area'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Enter valid price'
    if (showProjectInfo && !form.builderName.trim())
      e.builderName = 'Builder / Developer name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      const priceNum = Number(form.price)
      const areaNum = Number(form.area)
      const priceDisplay =
        form.priceUnit === '₹/mo' ? `${priceNum}K/mo`
          : form.priceUnit === '₹/sq ft' ? `₹${priceNum}/sqft`
            : `${priceNum} ${form.priceUnit}`

      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('category', form.category)
      fd.append('price', priceDisplay)
      fd.append('priceValue', String(priceNum))
      fd.append('area', `${areaNum} Sq.Ft`)
      fd.append('areaValue', String(areaNum))
      fd.append('type', form.propertyType)
      fd.append('bedrooms', form.bedrooms || '0')
      fd.append('bathrooms', form.bathrooms || '0')
      fd.append('furnishing', form.furnishing)
      fd.append('availableFor', JSON.stringify(form.availableFor))
      fd.append('amenities', JSON.stringify(form.amenities))
      fd.append('location', `${form.locality}, ${form.city}`)
      fd.append('city', form.city)
      fd.append('description', form.description)
      fd.append('availability', form.availability || 'Ready to Move')
      if (showProjectInfo) {
        fd.append('builderName', form.builderName)
        fd.append('projectStatus', form.projectStatus)
        fd.append('reraNumber', form.reraNumber)
        fd.append('launchDate', form.launchDate)
      }

      // Add existing images to keep
      fd.append('existingImages', JSON.stringify(existingImages))
      // Add images to remove
      fd.append('imagesToRemove', JSON.stringify(imagesToRemove))
      // Add new images
      images.forEach(file => fd.append('images', file))

      await updatePropertyApi(id!, fd)
      toast.success('Property updated successfully!')
      navigate('/my-properties')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update property')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to Edit Property</h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to edit your property.
          </p>
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dull transition"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-gray-500 text-lg">Loading property...</p>
      </div>
    )
  }

  const inputCls = (field?: keyof FormState) =>
    `w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition ${
      field && errors[field]
        ? 'border-red-400 bg-red-50 focus:border-red-500'
        : 'border-gray-300 focus:border-primary bg-white'
    }`

  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'
  const errMsg = (field: keyof FormState) =>
    errors[field] ? <p className="text-xs text-red-500 mt-1">{errors[field]}</p> : null

  const pillBtn = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${
      active
        ? 'bg-primary text-white border-primary'
        : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative w-full h-[20vh] md:h-[30vh] min-h-[20vh]">
        <img
          src="/pageImg.jpg"
          alt="Background"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -110 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Edit Property
          </motion.h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Your <span className="text-primary-dull">Property</span>
          </h1>
          <p className="text-gray-500 mt-1">Update the details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Section 1: Role ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">You are posting as</h2>
            <div className="flex flex-wrap gap-3">
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => set('role', role)}
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition cursor-pointer ${
                    form.role === role
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-2">{errors.role}</p>}
          </div>

          {/* ── Section 2: Category & Type ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Category</h2>

            <div className="flex flex-wrap gap-2 mb-5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={pillBtn(form.category === cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Property Type *</label>
                <select
                  value={form.propertyType}
                  onChange={e => set('propertyType', e.target.value)}
                  className={inputCls('propertyType')}
                >
                  <option value="">Select type</option>
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errMsg('propertyType')}
              </div>
              <div>
                <label className={labelCls}>Property Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder={
                    form.category === 'Plots & Land' ? 'e.g. 200 Sq Yd Plot in Sector 21' :
                      form.category === 'Commercial' ? 'e.g. Office Space in Bandra BKC' :
                        form.category === 'Projects' ? 'e.g. Godrej Woods Phase 2' :
                          form.category === 'New Launch' ? 'e.g. Prestige Lakeside Habitat' :
                            'e.g. 3 BHK Flat in Koramangala'
                  }
                  className={inputCls('title')}
                />
                {errMsg('title')}
              </div>
            </div>
          </div>

          {/* ── Section 3: Builder / Project Info ── */}
          {showProjectInfo && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Builder &amp; Project Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Builder / Developer Name *</label>
                  <input
                    type="text"
                    value={form.builderName}
                    onChange={e => set('builderName', e.target.value)}
                    placeholder="e.g. Godrej Properties"
                    className={inputCls('builderName')}
                  />
                  {errMsg('builderName')}
                </div>
                <div>
                  <label className={labelCls}>Project Status</label>
                  <select
                    value={form.projectStatus}
                    onChange={e => set('projectStatus', e.target.value)}
                    className={inputCls()}
                  >
                    <option value="">Select status</option>
                    {PROJECT_STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>RERA Number</label>
                  <input
                    type="text"
                    value={form.reraNumber}
                    onChange={e => set('reraNumber', e.target.value)}
                    placeholder="e.g. P52100012345"
                    className={inputCls()}
                  />
                </div>
                <div>
                  <label className={labelCls}>Launch / Possession Date</label>
                  <input
                    type="date"
                    value={form.launchDate}
                    onChange={e => set('launchDate', e.target.value)}
                    className={inputCls()}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Section 4: Location ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>City *</label>
                <select
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  className={inputCls('city')}
                >
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errMsg('city')}
              </div>
              <div>
                <label className={labelCls}>Locality / Area *</label>
                <input
                  type="text"
                  value={form.locality}
                  onChange={e => set('locality', e.target.value)}
                  placeholder="e.g. Koramangala, Sector 21"
                  className={inputCls('locality')}
                />
                {errMsg('locality')}
              </div>
              {/* <div className="sm:col-span-2">
                <label className={labelCls}>Full Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder="Building name, Street, Landmark"
                  className={inputCls()}
                />
              </div> */}
            </div>
          </div>

          {/* ── Section 5: Property Details ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h2>
            <div className={`grid gap-4 ${
              showRooms && showFurnishing
                ? 'grid-cols-2 sm:grid-cols-4'
                : showRooms || showFurnishing
                  ? 'grid-cols-2 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
            }`}>
              {showRooms && (
                <>
                  <div>
                    <label className={labelCls}>Bedrooms</label>
                    <select
                      value={form.bedrooms}
                      onChange={e => set('bedrooms', e.target.value)}
                      className={inputCls()}
                    >
                      <option value="">Any</option>
                      {['1', '2', '3', '4', '5', '5+'].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Bathrooms</label>
                    <select
                      value={form.bathrooms}
                      onChange={e => set('bathrooms', e.target.value)}
                      className={inputCls()}
                    >
                      <option value="">Any</option>
                      {['1', '2', '3', '4', '5+'].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className={labelCls}>
                  {form.category === 'Plots & Land' ? 'Plot Area (sq yd / sq ft) *' : 'Area (sq ft) *'}
                </label>
                <input
                  type="number"
                  value={form.area}
                  onChange={e => set('area', e.target.value)}
                  placeholder={form.category === 'Plots & Land' ? 'e.g. 200' : 'e.g. 1200'}
                  min={1}
                  className={inputCls('area')}
                />
                {errMsg('area')}
              </div>

              {showFurnishing && (
                <div>
                  <label className={labelCls}>Furnishing</label>
                  <select
                    value={form.furnishing}
                    onChange={e => set('furnishing', e.target.value)}
                    className={inputCls()}
                  >
                    <option value="">Select</option>
                    {FURNISHING_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 6: Pricing ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h2>
            <div className="flex gap-3 items-start max-w-xs">
              <div className="flex-1">
                <label className={labelCls}>
                  {form.category === 'Rent' ? 'Rent Amount *' : 'Price *'}
                </label>
                <input
                  type="number"
                  value={form.priceValue}
                  onChange={e => set('priceValue', e.target.value)}
                  placeholder={
                    form.category === 'Rent' ? 'e.g. 25000' : 'e.g. 45'
                  }
                  min={0}
                  className={inputCls('priceValue')}
                />
                {errMsg('priceValue')}
              </div>
              <div className="w-28">
                <label className={labelCls}>Unit</label>
                <select
                  value={form.priceUnit}
                  onChange={e => set('priceUnit', e.target.value)}
                  className={inputCls()}
                >
                  {priceUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Section 7: Availability ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Availability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Possession Status</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set('availability', opt)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                        form.availability === opt
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 text-gray-600 hover:border-primary'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {showAvailFor && (
                <div>
                  <label className={labelCls}>Available For</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {AVAILABLE_FOR_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleMulti('availableFor', opt)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                          form.availableFor.includes(opt)
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 text-gray-600 hover:border-primary'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 8: Images ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Property Images</h2>
            <p className="text-sm text-gray-800 mb-4">
              You can update up to 6 images total (JPG, PNG). First image will be the cover.
            </p>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 group"
                    >
                      {/* <img src={src} alt={`existing-${idx}`} className="w-full h-full object-cover" /> */}
                      <img src={`http://localhost:5000${src}`} alt={`existing-${idx}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        <FiX className="text-gray-700 text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images */}
            <div className="flex flex-wrap gap-3">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 group"
                >
                  <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <FiX className="text-gray-700 text-xs" />
                  </button>
                </div>
              ))}

              {(existingImages.length - imagesToRemove.length + images.length) < 6 && (
                <label
                  htmlFor="prop-images"
                  className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-primary/5 transition"
                >
                  <FiUploadCloud className="text-2xl text-gray-400" />
                  <span className="text-xs text-gray-400">Add Photo</span>
                  <input
                    ref={fileInputRef}
                    id="prop-images"
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={e => handleImages(e.target.files)}
                  />
                </label>
              )}
            </div>
          </div>

          {/* ── Section 9: Amenities ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {AMENITIES_LIST.map(amenity => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition ${
                    form.amenities.includes(amenity)
                      ? 'border-transparent bg-primary/5 text-primary font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-primary/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={form.amenities.includes(amenity)}
                    onChange={() => toggleMulti('amenities', amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {/* ── Section 10: Description ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={5}
              placeholder={
                showProjectInfo
                  ? 'Describe the project — configurations, nearby landmarks, USPs, RERA details...'
                  : 'Describe your property — highlights, nearby landmarks, special features...'
              }
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none text-sm resize-none focus:border-primary transition"
            />
          </div>

          {/* ── Submit ── */}
          <div className="flex justify-end pb-10 gap-4">
            <button
              type="button"
              onClick={() => navigate('/my-properties')}
              className="px-4 py-1.5 md:px-8 md:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition cursor-pointer text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 md:px-10 md:py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dull transition disabled:opacity-60 cursor-pointer text-base"
            >
              {submitting ? 'Updating...' : 'Update Property'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditProperty
