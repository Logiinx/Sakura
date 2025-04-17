import React, { useState } from "react"
import { FaChevronLeft, FaChevronRight, FaCalendarAlt as CalendarIcon } from "react-icons/fa"

import { useToast } from "@/hooks/use-toast"
import { format, isToday, isSameDay, addDays, startOfWeek, addWeeks, eachDayOfInterval, isWeekend } from "date-fns"

// Simulate available time slots
const getAvailableTimesForDate = (date: Date) => {
  // Weekend has more available slots
  if (isWeekend(date)) {
    return ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
  }

  // Weekdays have fewer slots
  return ["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "4:00 PM"]
}

// Simulate some slots as already booked
const getRandomUnavailableTimes = (allTimes: string[]) => {
  const unavailableTimes = []
  // Randomly mark some times as unavailable
  for (const time of allTimes) {
    if (Math.random() > 0.7) {
      // 30% chance of a slot being unavailable
      unavailableTimes.push(time)
    }
  }
  return unavailableTimes
}

const BookNow = () => {
  const { toast } = useToast()
  const [_currentDate, _setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    packageType: "",
    notes: "",
  })

  // Calculate the start of the current week view
  const startDate = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 0 })

  // Generate an array of days for the current week view
  const daysOfWeek = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 6),
  })

  // Get available time slots based on selected date
  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : []

  // Simulate some times being unavailable (already booked)
  const unavailableTimes = selectedDate ? getRandomUnavailableTimes(availableTimes) : []

  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1)
  }

  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Selection required",
        description: "Please select both a date and time.",
        variant: "destructive",
      })
      return
    }

    setBookingStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Selection required",
        description: "Please select both a date and time.",
        variant: "destructive",
      })
      return
    }

    try {
      // Here you would normally send the booking details to your server
      // For this demo, we'll just simulate a successful booking
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Booking confirmed!",
        description: `Your session is scheduled for ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime}.`,
      })

      // Reset form
      setSelectedDate(null)
      setSelectedTime(null)
      setBookingStep(1)
      setBookingDetails({
        name: "",
        email: "",
        phone: "",
        packageType: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error booking session:", error)
      toast({
        title: "Something went wrong",
        description: "Failed to book your session. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    setBookingStep(1)
  }

  return (
    <div className="animate-fade-in">
      <section className="py-16 md:py-24">
        <div className="sakura-container">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Book Your Session</h1>
            <div className="mx-auto h-1 w-20 bg-sakura-pink"></div>
            <p className="mx-auto mt-6 max-w-2xl text-gray-600">
              Choose a date and time that works for you, and we&apos;ll help you capture beautiful memories.
            </p>
          </div>

          {bookingStep === 1 ? (
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-playfair text-2xl font-bold">Select Date & Time</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePreviousWeek}
                      className="rounded-full p-2 transition-colors hover:bg-sakura-light-pink"
                      disabled={weekOffset === 0}>
                      <FaChevronLeft className={weekOffset === 0 ? "text-gray-300" : ""} />
                    </button>
                    <button
                      onClick={handleNextWeek}
                      className="rounded-full p-2 transition-colors hover:bg-sakura-light-pink">
                      <FaChevronRight />
                    </button>
                  </div>
                </div>

                {/* Calendar */}
                <div className="mb-8">
                  <div className="mb-2 grid grid-cols-7 gap-2 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => {
                      const isSelected = selectedDate && isSameDay(day, selectedDate)
                      const isPast = day < new Date() && !isToday(day)

                      return (
                        <button
                          key={day.toString()}
                          onClick={() => !isPast && handleDateSelect(day)}
                          disabled={isPast}
                          className={`flex h-16 flex-col items-center justify-center rounded-md p-3 ${isPast ? "cursor-not-allowed text-gray-300" : "cursor-pointer hover:bg-sakura-light-pink"} ${isSelected ? "bg-sakura-pink text-white" : "bg-gray-50"} ${isToday(day) && !isSelected ? "border-2 border-sakura-pink" : ""} `}>
                          <span className="text-sm">{format(day, "MMM")}</span>
                          <span className="text-lg font-medium">{format(day, "d")}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-xl font-medium">
                      Available Times for {format(selectedDate, "MMMM d, yyyy")}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {availableTimes.map((time) => {
                        const isUnavailable = unavailableTimes.includes(time)
                        const isTimeSelected = selectedTime === time

                        return (
                          <button
                            key={time}
                            onClick={() => !isUnavailable && handleTimeSelect(time)}
                            disabled={isUnavailable}
                            className={`rounded-md px-4 py-2 text-center ${isUnavailable ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""} ${
                              isTimeSelected
                                ? "bg-sakura-pink text-white"
                                : !isUnavailable
                                  ? "bg-sakura-light-pink hover:bg-opacity-70"
                                  : ""
                            } `}>
                            {time}
                          </button>
                        )
                      })}
                    </div>

                    {availableTimes.length === 0 && (
                      <p className="py-4 text-center text-gray-600">No available times for this date.</p>
                    )}
                  </div>
                )}

                {/* Continue button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={handleContinue}
                    disabled={!selectedDate || !selectedTime}
                    className={`sakura-btn w-full sm:w-auto ${
                      !selectedDate || !selectedTime ? "cursor-not-allowed opacity-50" : ""
                    }`}>
                    Continue to Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-6 font-playfair text-2xl font-bold">Complete Your Booking</h2>

                <div className="mb-6 rounded-lg bg-sakura-light-gray p-4">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 text-sakura-pink" />
                    <p>
                      <strong>Selected Date & Time:</strong> {selectedDate && format(selectedDate, "MMMM d, yyyy")} at{" "}
                      {selectedTime}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block font-medium">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={bookingDetails.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block font-medium">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={bookingDetails.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-2 block font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={bookingDetails.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="packageType" className="mb-2 block font-medium">
                        Package <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="packageType"
                        name="packageType"
                        value={bookingDetails.packageType}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"
                        required>
                        <option value="">Select a package</option>
                        <option value="basic">Basic ($199)</option>
                        <option value="standard">Standard ($349)</option>
                        <option value="premium">Premium ($599)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="mb-2 block font-medium">
                      Special Requests / Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={bookingDetails.notes}
                      onChange={handleChange}
                      className="w-full resize-none rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sakura-pink"></textarea>
                  </div>

                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="rounded-md border border-sakura-pink px-6 py-3 text-sakura-pink transition-colors hover:bg-sakura-light-pink">
                      Back to Calendar
                    </button>
                    <button type="submit" className="sakura-btn">
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BookNow
