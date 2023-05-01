"use client";
import { useMemo, useState } from 'react';

import { FieldValues, useForm } from 'react-hook-form';
import useRentModal from '@/hooks/useRentModal'

import Modal from './Modal'
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import { categories } from '../navbar/Categories';
import dynamic from 'next/dynamic';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';

// * untuk handle step modal rent
enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathRoomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        }
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathRoomCount = watch('bathRoomCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'),
        { ssr: false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ), [location]) //? ssr = server side rendering, location it's meaning is location from watch('location')

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    }

    const onBack = () => {
        setStep((value) => value - 1)
    }
    const onNext = () => {
        setStep((value) => value + 1)
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) return 'Create'

        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) return undefined

        return 'Back'
    }, [step])

    // * Listing creation steps 1 (Category Selection)
    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title='Which of these best describes your place?'
                subtitle='Choose a category'
            />
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2 max-h-[50vh] overflow-y-auto' >
                {categories.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    // * Listing creation steps 2 (Location selection, Map component, Country autoComplete)
    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Where is your place located?'
                    subtitle='Help guests find you!'
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map center={location?.latlng} />
            </div>
        )
    }

    // * Listing creation steps 3 (Counter components for guest, room, bathroom)
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Share some basics about your place'
                    subtitle='What amenities di you have?'
                />
                <Counter
                    title='Guest'
                    subtitle='How many guests do you allow?'
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title='Rooms'
                    subtitle='How many rooms do you have?'
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title='Bathroom'
                    subtitle='How many bathrooms do you have?'
                    value={bathRoomCount}
                    onChange={(value) => setCustomValue('bathRoomCount', value)}
                />
            </div>
        )
    }

    // * Listing creation steps 4 (Image upload, Cloudinary CDN) 
    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className='flex flex-col gap-8 '>
                <Heading
                    title='Add a photo of your place'
                    subtitle='Show guests what your place looks like!'
                />
                <ImageUpload
                    onChange={(value) => setCustomValue('imageSrc', value)}
                    value={imageSrc}
                />
            </div>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            title='Airbnb your home'
            onClose={rentModal.onClose}
            onSubmit={onNext}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            body={bodyContent}
        />
    )
}

export default RentModal