import { useEffect, useState } from 'react';

function Icon({ children, size = 18, className = '' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {children}
        </svg>
    );
}

function PlusIcon({ size = 16 }) {
    return (
        <Icon size={size}>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </Icon>
    );
}

function CheckIcon({ size = 16 }) {
    return (
        <Icon size={size}>
            <path d="m5 12 4 4L19 6" />
        </Icon>
    );
}

function CloseIcon({ size = 17 }) {
    return (
        <Icon size={size}>
            <path d="m6 6 12 12" />
            <path d="M18 6 6 18" />
        </Icon>
    );
}

function TrashIcon({ size = 15 }) {
    return (
        <Icon size={size}>
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
        </Icon>
    );
}

function EditIcon({ size = 17 }) {
    return (
        <Icon size={size}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </Icon>
    );
}

function SparkIcon({ size = 15 }) {
    return (
        <Icon size={size}>
            <path d="m12 3-1.2 5.3L6 10l4.8 1.7L12 17l1.2-5.3L18 10l-4.8-1.7Z" />
            <path d="m19 15-.6 2.4L16 18l2.4.6L19 21l.6-2.4L22 18l-2.4-.6Z" />
        </Icon>
    );
}

function EyeIcon({ size = 18 }) {
    return (
        <Icon size={size}>
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
            <circle cx="12" cy="12" r="2.5" />
        </Icon>
    );
}

function EyeOffIcon({ size = 18 }) {
    return (
        <Icon size={size}>
            <path d="m3 3 18 18" />
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
            <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a18.4 18.4 0 0 1-3.1 3.9" />
            <path d="M6.2 6.2C3.7 8 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.6-.8" />
        </Icon>
    );
}

function ChevronDown({ size = 16 }) {
    return (
        <Icon size={size}>
            <path d="m6 9 6 6 6-6" />
        </Icon>
    );
}

function Spinner() {
    return (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    );
}

function ModalSection({ title, description }) {
    return (
        <div>
            <h3 className="font-display text-sm font-bold text-ink">
                {title}
            </h3>

            {description && (
                <p className="mt-1 text-xs leading-5 text-ink-muted">
                    {description}
                </p>
            )}
        </div>
    );
}

function FormField({
    label,
    required = false,
    hint,
    children,
}) {
    return (
        <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-ink">
                    {label}
                    {required && (
                        <span className="ml-1 text-coral">*</span>
                    )}
                </span>

                {hint && (
                    <span className="text-[10px] font-medium text-ink-faint">
                        {hint}
                    </span>
                )}
            </div>

            {children}
        </label>
    );
}

function CustomDropdown({
    value,
    onChange,
    options,
    placeholder = 'Select',
}) {
    const [open, setOpen] = useState(false);

    const selected =
        options.find(
            (option) => String(option.value) === String(value)
        ) || null;

    useEffect(() => {
        function handleOutside(event) {
            if (!event.target.closest('[data-service-dropdown]')) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutside
            );
        };
    }, []);

    return (
        <div
            className="relative"
            data-service-dropdown
        >
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`
          flex h-11 w-full items-center justify-between
          rounded-xl border bg-canvas-soft px-3.5
          text-left transition-all outline-none
          ${open
                        ? 'border-brand bg-white ring-4 ring-brand/10'
                        : 'border-border hover:border-brand/30 hover:bg-white'
                    }
        `}
            >
                <span
                    className={`text-sm font-medium ${selected
                            ? 'text-ink'
                            : 'text-ink-faint'
                        }`}
                >
                    {selected?.label || placeholder}
                </span>

                <ChevronDown
                    className={`text-ink-muted transition-transform ${open ? 'rotate-180 text-brand' : ''
                        }`}
                />
            </button>

            {open && (
                <div className="
          absolute left-0 right-0 top-[calc(100%+7px)]
          z-[120] max-h-56 overflow-y-auto
          rounded-xl border border-border
          bg-white p-1.5
          shadow-[0_18px_45px_rgba(21,22,43,0.14)]
        ">
                    {options.map((option) => {
                        const active =
                            String(option.value) === String(value);

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className={`
                  flex w-full items-center justify-between
                  rounded-lg px-3 py-2.5 text-left
                  transition
                  ${active
                                        ? 'bg-brand-soft text-brand'
                                        : 'text-ink hover:bg-canvas-soft'
                                    }
                `}
                            >
                                <span className="text-sm font-medium">
                                    {option.label}
                                </span>

                                {active && (
                                    <CheckIcon
                                        size={15}
                                        className="text-brand"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ArrayEditor({
    label,
    description,
    values,
    onChange,
    placeholder,
    accent = 'brand',
}) {
    const [input, setInput] = useState('');

    function addItem() {
        const value = input.trim();

        if (!value) return;

        onChange([
            ...values,
            value,
        ]);

        setInput('');
    }

    function removeItem(index) {
        onChange(
            values.filter((_, itemIndex) => itemIndex !== index)
        );
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addItem();
        }
    }

    const accentClasses =
        accent === 'coral'
            ? 'bg-coral-soft text-coral'
            : 'bg-brand-soft text-brand';

    return (
        <div>
            <div className="mb-3">
                <p className="text-xs font-bold text-ink">
                    {label}
                </p>

                <p className="mt-1 text-[11px] leading-5 text-ink-muted">
                    {description}
                </p>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(event) =>
                        setInput(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="service-input flex-1"
                />

                <button
                    type="button"
                    onClick={addItem}
                    className={`
            inline-flex h-11 shrink-0 items-center
            gap-1.5 rounded-xl px-3.5
            text-xs font-bold transition
            ${accentClasses}
            hover:opacity-80
          `}
                >
                    <PlusIcon size={14} />
                    Add
                </button>
            </div>

            {values.length > 0 && (
                <div className="mt-3 space-y-2">
                    {values.map((item, index) => (
                        <div
                            key={`${item}-${index}`}
                            className="
                group flex items-start gap-3
                rounded-xl border border-border
                bg-canvas-soft px-3 py-2.5
              "
                        >
                            <span
                                className={`
                  mt-0.5 flex h-5 w-5 shrink-0
                  items-center justify-center
                  rounded-md text-[10px] font-bold
                  ${accentClasses}
                `}
                            >
                                {index + 1}
                            </span>

                            <span className="min-w-0 flex-1 text-xs leading-5 text-ink">
                                {item}
                            </span>

                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="
                  flex h-7 w-7 shrink-0 items-center
                  justify-center rounded-lg
                  text-ink-faint transition
                  hover:bg-coral-soft hover:text-coral
                "
                                title="Remove"
                            >
                                <TrashIcon size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ServiceModal({
    editing,
    form,
    categories,
    saving,
    updateForm,
    onClose,
    onSubmit,
}) {
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        function handleKeyDown(event) {
            if (
                event.key === 'Escape' &&
                !saving
            ) {
                onClose();
            }
        }

        document.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown
            );
        };
    }, [onClose, saving]);

    function updateArray(field, value) {
        updateForm(field, value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        setSubmitError('');

        if (!form.title?.trim()) {
            setSubmitError('Service title is required.');
            return;
        }

        if (
            form.price !== '' &&
            form.price !== null &&
            Number(form.price) < 0
        ) {
            setSubmitError(
                'Price cannot be negative.'
            );
            return;
        }

        onSubmit(event);
    }

    const priceIsCustom =
        form.price === '' ||
        form.price === null ||
        form.price === undefined;

    return (
        <div
            className="
        fixed inset-0 z-[100]
        flex items-end justify-center
        bg-ink/30 p-0
        backdrop-blur-[3px]
        sm:items-center sm:p-5
      "
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="
          flex max-h-[96vh] w-full
          max-w-3xl flex-col
          overflow-hidden
          rounded-t-[26px]
          border border-border
          bg-white
          shadow-[0_30px_100px_rgba(21,22,43,0.2)]
          sm:max-h-[92vh]
          sm:rounded-3xl
        "
            >
                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div className="
          flex shrink-0 items-center
          justify-between border-b border-border
          px-5 py-4.5 sm:px-6
        ">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl bg-brand-soft text-brand
            ">
                            {editing ? (
                                <EditIcon />
                            ) : (
                                <PlusIcon size={18} />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="
                text-[10px] font-bold uppercase
                tracking-[0.15em] text-brand
              ">
                                {editing
                                    ? 'Service management'
                                    : 'New service'}
                            </p>

                            <h2 className="
                mt-0.5 truncate
                font-display text-lg font-bold
                text-ink sm:text-xl
              ">
                                {editing
                                    ? 'Edit Service'
                                    : 'Add Service'}
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl text-ink-muted
              transition hover:bg-canvas-soft
              hover:text-ink
              disabled:opacity-40
            "
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* ================================================== */}
                {/* FORM */}
                {/* ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="
            min-h-0 overflow-y-auto
            px-5 py-5 sm:px-6 sm:py-6
          "
                >
                    {/* Intro */}

                    <div className="
            rounded-2xl border border-brand/10
            bg-brand-softer p-4
          ">
                        <div className="flex gap-3">
                            <div className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl bg-white
                text-brand shadow-sm
              ">
                                <SparkIcon size={18} />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-ink">
                                    {editing
                                        ? 'Update your service'
                                        : 'Create a customer-ready service'}
                                </p>

                                <p className="
                  mt-1 max-w-xl
                  text-xs leading-5 text-ink-muted
                ">
                                    Add clear pricing, package details,
                                    features and benefits so customers
                                    can understand exactly what they are
                                    purchasing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* BASIC INFORMATION */}
                    {/* ================================================== */}

                    <div className="mt-7">
                        <ModalSection
                            title="Basic information"
                            description="The main details customers will see."
                        />

                        <div className="mt-4 space-y-4">
                            <FormField
                                label="Service title"
                                required
                                hint={`${form.title?.length || 0}/180`}
                            >
                                <input
                                    type="text"
                                    value={form.title || ''}
                                    onChange={(event) =>
                                        updateForm(
                                            'title',
                                            event.target.value
                                        )
                                    }
                                    maxLength={180}
                                    autoFocus
                                    placeholder="Example: 30-Second Video Ad"
                                    className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted"
                                />
                            </FormField>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField label="Category">
                                    <CustomDropdown
                                        value={form.category_id || ''}
                                        onChange={(value) =>
                                            updateForm(
                                                'category_id',
                                                value
                                            )
                                        }
                                        placeholder="Select category"
                                        options={[
                                            {
                                                value: '',
                                                label: 'No category',
                                            },
                                            ...categories.map(
                                                (category) => ({
                                                    value: String(
                                                        category.id
                                                    ),
                                                    label: category.name,
                                                })
                                            ),
                                        ]}
                                    />
                                </FormField>

                                <FormField
                                    label="Tier / Package group"
                                    hint="Optional"
                                >
                                    <input
                                        type="text"
                                        value={form.tier || ''}
                                        onChange={(event) =>
                                            updateForm(
                                                'tier',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Example: Standard Ads"
                                        className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted"
                                    />
                                </FormField>
                            </div>

                            <FormField
                                label="Short description"
                                hint={`${form.short_description?.length || 0}/300`}
                            >
                                <input
                                    type="text"
                                    value={
                                        form.short_description || ''
                                    }
                                    onChange={(event) =>
                                        updateForm(
                                            'short_description',
                                            event.target.value
                                        )
                                    }
                                    maxLength={300}
                                    placeholder="A short description customers will understand"
                                    className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted"
                                />
                            </FormField>

                            <FormField
                                label="Full description"
                                hint="Optional"
                            >
                                <textarea
                                    rows={4}
                                    value={form.description || ''}
                                    onChange={(event) =>
                                        updateForm(
                                            'description',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Describe the service, what customers receive and who it is suitable for..."
                                    className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted resize-none"
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* PRICING */}
                    {/* ================================================== */}

                    <div className="mt-8">
                        <ModalSection
                            title="Pricing & duration"
                            description="Set fixed pricing, custom pricing and package timing."
                        />

                        <div className="
              mt-4 rounded-2xl
              border border-border
              bg-canvas-soft p-4
            ">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    label="Price"
                                    hint={
                                        priceIsCustom
                                            ? 'Custom pricing'
                                            : 'Before applicable tax'
                                    }
                                >
                                    <div className="relative">
                                        <span className="
                      pointer-events-none
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-sm font-bold
                      text-ink-muted
                    ">
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                form.price === null
                                                    ? ''
                                                    : form.price ?? ''
                                            }
                                            onChange={(event) =>
                                                updateForm(
                                                    'price',
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Custom pricing"
                                            className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted pl-8"
                                        />
                                    </div>
                                </FormField>

                                <FormField
                                    label="Price suffix"
                                    hint="Optional"
                                >
                                    <input
                                        type="text"
                                        value={
                                            form.price_suffix || ''
                                        }
                                        onChange={(event) =>
                                            updateForm(
                                                'price_suffix',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Example: +GST or / month"
                                        className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted"
                                    />
                                </FormField>
                            </div>

                            <div className="mt-4">
                                <FormField
                                    label="Duration"
                                    hint="Optional"
                                >
                                    <input
                                        type="text"
                                        value={form.duration || ''}
                                        onChange={(event) =>
                                            updateForm(
                                                'duration',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Example: 30 days, 30 seconds, Monthly"
                                        className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted"
                                    />
                                </FormField>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {priceIsCustom ? (
                                    <span className="
                    inline-flex items-center gap-1.5
                    rounded-lg bg-brand-soft
                    px-2.5 py-1.5
                    text-[10px] font-bold text-brand
                  ">
                                        <SparkIcon size={13} />
                                        Custom pricing
                                    </span>
                                ) : (
                                    <span className="
                    inline-flex items-center gap-1.5
                    rounded-lg bg-whatsapp-soft
                    px-2.5 py-1.5
                    text-[10px] font-bold text-whatsapp-deep
                  ">
                                        <CheckIcon size={13} />
                                        ₹
                                        {Number(form.price || 0).toLocaleString(
                                            'en-IN'
                                        )}
                                        {form.price_suffix
                                            ? ` ${form.price_suffix}`
                                            : ''}
                                    </span>
                                )}

                                {form.duration && (
                                    <span className="
                    inline-flex items-center
                    rounded-lg bg-white
                    px-2.5 py-1.5
                    text-[10px] font-bold
                    text-ink-muted
                  ">
                                        {form.duration}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* FEATURES */}
                    {/* ================================================== */}

                    <div className="mt-8">
                        <ModalSection
                            title="What's included"
                            description="Add the key features or deliverables included in this service."
                        />

                        <div className="
              mt-4 rounded-2xl
              border border-border
              bg-white p-4
            ">
                            <ArrayEditor
                                label="Features"
                                description="These will appear as the main included items."
                                values={
                                    Array.isArray(form.features)
                                        ? form.features
                                        : []
                                }
                                onChange={(value) =>
                                    updateArray(
                                        'features',
                                        value
                                    )
                                }
                                placeholder="Example: Facebook & Instagram ad included"
                            />
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* NOTES + FREEBIES */}
                    {/* ================================================== */}

                    <div className="mt-8">
                        <ModalSection
                            title="Additional details"
                            description="Add conditions, extra charges and complimentary items."
                        />

                        <div className="
              mt-4 space-y-5
              rounded-2xl border border-border
              bg-canvas-soft p-4
            ">
                            <ArrayEditor
                                label="Notes"
                                description="Important information customers should know."
                                values={
                                    Array.isArray(form.notes)
                                        ? form.notes
                                        : []
                                }
                                onChange={(value) =>
                                    updateArray(
                                        'notes',
                                        value
                                    )
                                }
                                placeholder="Example: Poster / video charges extra"
                                accent="coral"
                            />

                            <div className="h-px bg-border" />

                            <FormField
                                label="Freebies"
                                hint="Optional"
                            >
                                <input
                                    type="text"
                                    value={form.freebies || ''}
                                    onChange={(event) =>
                                        updateForm(
                                            'freebies',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Example: 4 posters & 2 videos free"
                                    className="w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand/30 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:bg-canvas-soft disabled:text-ink-muted"
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* POPULAR */}
                    {/* ================================================== */}

                    <div className="mt-8">
                        <ModalSection
                            title="Marketing visibility"
                            description="Highlight this service as a recommended or popular package."
                        />

                        <div className="
              mt-4 rounded-2xl
              border border-border
              bg-surface p-4
            ">
                            <div className="
                flex items-center
                justify-between gap-4
              ">
                                <div className="flex items-center gap-3">
                                    <div className={`
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    ${Boolean(form.popular)
                                            ? 'bg-brand-soft text-brand'
                                            : 'bg-canvas-soft text-ink-muted'
                                        }
                  `}>
                                        <SparkIcon />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-ink">
                                            Popular service
                                        </p>

                                        <p className="
                      mt-0.5 text-xs
                      leading-5 text-ink-muted
                    ">
                                            Mark this package as popular
                                            to give it extra attention.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={Boolean(Number(form.popular))}
                                    onClick={() =>
                                        updateForm(
                                            'popular',
                                            Number(form.popular) ? 0 : 1
                                        )
                                    }
                                    className={`
                      relative h-6 w-11 shrink-0 rounded-full
                      p-0.5 outline-none transition-all duration-200
                      focus:ring-4 focus:ring-brand/10
                      ${Number(form.popular)
                                            ? 'bg-brand'
                                            : 'bg-border'}
                  `}
                                >
                                    <span
                                        className={`
                        block h-5 w-5 rounded-full bg-white
                        shadow-sm transition-transform duration-200
                        ${Number(form.popular)
                                                ? 'translate-x-5'
                                                : 'translate-x-0'}
                    `}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* VISIBILITY */}
                    {/* ================================================== */}

                    <div className="mt-8">
                        <ModalSection
                            title="Visibility"
                            description="Control whether customers can see this service."
                        />

                        <div className="
              mt-4 rounded-2xl
              border border-border
              bg-surface p-4
            ">
                            <div className="
                flex items-center
                justify-between gap-4
              ">
                                <div className="flex items-center gap-3">
                                    <div className={`
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    ${Number(form.is_active) === 1
                                            ? 'bg-whatsapp-soft text-whatsapp-deep'
                                            : 'bg-canvas-soft text-ink-muted'
                                        }
                  `}>
                                        {Number(form.is_active) === 1 ? (
                                            <EyeIcon />
                                        ) : (
                                            <EyeOffIcon />
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-ink">
                                            {Number(form.is_active) === 1
                                                ? 'Active service'
                                                : 'Inactive service'}
                                        </p>

                                        <p className="
                      mt-0.5 text-xs
                      leading-5 text-ink-muted
                    ">
                                            {Number(form.is_active) === 1
                                                ? 'Customers can see this service.'
                                                : 'This service is hidden from customers.'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={Number(form.is_active) === 1}
                                    onClick={() =>
                                        updateForm(
                                            'is_active',
                                            Number(form.is_active) === 1 ? 0 : 1
                                        )
                                    }
                                    className={`
                      relative h-6 w-11 shrink-0 rounded-full
                      p-0.5 outline-none transition-all duration-200
                      focus:ring-4 focus:ring-brand/10
                      ${Number(form.is_active) === 1
                                            ? 'bg-brand'
                                            : 'bg-border'}
                  `}
                                >
                                    <span
                                        className={`
                        block h-5 w-5 rounded-full bg-white
                        shadow-sm transition-transform duration-200
                        ${Number(form.is_active) === 1
                                                ? 'translate-x-5'
                                                : 'translate-x-0'}
                    `}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ================================================== */}
                    {/* ERROR */}
                    {/* ================================================== */}

                    {submitError && (
                        <div className="
              mt-6 flex items-start gap-3
              rounded-xl border border-coral/20
              bg-coral-soft px-4 py-3
            ">
                            <div className="
                flex h-6 w-6 shrink-0
                items-center justify-center
                rounded-lg bg-white
                text-coral
              ">
                                !
                            </div>

                            <p className="
                text-xs font-semibold
                leading-5 text-coral-deep
              ">
                                {submitError}
                            </p>
                        </div>
                    )}

                    {/* ================================================== */}
                    {/* FOOTER */}
                    {/* ================================================== */}

                    <div className="
            mt-8 flex flex-col-reverse
            gap-3 border-t border-border
            pt-5 sm:flex-row
            sm:justify-end
          ">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                rounded-xl border border-border
                bg-white px-5 py-2.5
                text-sm font-bold text-ink
                transition hover:bg-canvas-soft
                disabled:opacity-50
              "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="
                inline-flex items-center
                justify-center gap-2
                rounded-xl bg-brand
                px-5 py-2.5
                text-sm font-bold text-white
                shadow-lg shadow-brand/20
                transition
                hover:bg-brand-deep
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
                        >
                            {saving ? (
                                <>
                                    <Spinner />
                                    {editing
                                        ? 'Updating…'
                                        : 'Creating…'}
                                </>
                            ) : (
                                <>
                                    <CheckIcon />
                                    {editing
                                        ? 'Update Service'
                                        : 'Create Service'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
