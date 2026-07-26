import prismaInstance from "@repo/db";

export async function getTourByPlacesAction(
  placeName: string,
  date: string,
  persons: number,
) {
  // The query now selects the additional fields needed by the frontend
  const tours = await prismaInstance.offeredTour.findMany({
    where: {
      startDate: {
        gte: new Date(date),
      },
      dayPlan: {
        some: {
          itineraries: {
            some: {
              place: {
                name: {
                  contains: placeName,
                  mode: "insensitive", // Case-insensitive search
                },
              },
            },
          },
        },
      },
    },
    select: {
      // Fields needed for filtering by available spots
      maximumPeople: true,
      minimumPeople: true,

      bookings: {
        where: {
          status: { in: ["Pending", "Confirmed"] },
        },
        include: {
          persons: true,
        },
      },
      // Fields needed for the TourGrid component
      id: true,
      startDate: true,
      endDate: true,
      price: true,
      reviews: true, // For calculating rating and count
      dayPlan: {
        select: {
          itineraries: {
            select: {
              place: {
                select: {
                  name: true,
                  photos: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // 1. First, filter tours by available spots
  const availableTours = tours
    .map((tour) => {
      const bookedPersons = tour.bookings.reduce(
        (sum, booking) => booking.persons.length + sum,
        0,
      );
      const availableSpot = tour.maximumPeople - bookedPersons;
      return {
        ...tour,
        availableSpot,
      };
    })
    .filter((tour) => tour.availableSpot >= persons);

  // 2. Then, map the filtered tours to the exact format the frontend expects
  return availableTours.map((tour) => ({
    id: tour.id,
    startDate: tour.startDate.toISOString(),
    endDate: tour.endDate.toISOString(),
    price: tour.price.toNumber(),
    dayPlan: tour.dayPlan,
    averageRating:
      tour.reviews.length > 0
        ? tour.reviews.reduce((sum, review) => sum + review.star, 0) /
          tour.reviews.length
        : 0,
    reviewCount: tour.reviews.length,
  }));
}

export async function getAllToursAction() {
  const tours = await prismaInstance.offeredTour.findMany({
    select: {
      id: true,
      startDate: true,
      endDate: true,
      price: true,
      reviews: true,
      maximumPeople: true,
      minimumPeople: true,
      bookings: true,
      dayPlan: {
        select: {
          itineraries: {
            select: {
              place: {
                select: {
                  name: true,
                  photos: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return tours.map((tour) => ({
    ...tour,
    startDate: tour.startDate.toISOString(),
    endDate: tour.endDate.toISOString(),
    price: tour.price.toNumber(),
    averageRating:
      tour.reviews.length > 0
        ? tour.reviews.reduce((sum, review) => sum + review.star, 0) /
          tour.reviews.length
        : 0,
    reviewCount: tour.reviews.length,
  }));
}

export async function getTourByIdAction(id: string | bigint) {
  const tourId = BigInt(id);
  const tour = await prismaInstance.offeredTour.findUnique({
    where: {
      id: tourId,
    },
    select: {
      id: true,
      minimumPeople: true,
      maximumPeople: true,
      price: true,
      startDate: true,
      agentId: true,
      endDate: true,
      dayPlan: {
        select: {
          id: true,
          itineraries: {
            select: {
              place: {
                select: {
                  photos: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return {
    ...tour,
    startDate: tour?.startDate.toISOString(),
    endDate: tour?.endDate.toISOString(),
    price: tour?.price.toNumber(),
  };
}

export const getToursByAgentAction = async (agentId: string | bigint) => {
  try {
    agentId = BigInt(agentId);
    const tours = await prismaInstance.offeredTour.findMany({
      where: {
        agentId,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        price: true,
        reviews: true,
        bookings: true,
        maximumPeople: true,
        minimumPeople: true,
        dayPlan: {
          select: {
            itineraries: {
              select: {
                place: {
                  select: {
                    name: true,
                    photos: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return tours.map((tour) => ({
      ...tour,
      startDate: tour.startDate.toISOString(),
      endDate: tour.endDate.toISOString(),
      price: tour.price.toNumber(),
      averageRating:
        tour.reviews.length > 0
          ? tour.reviews.reduce((sum, review) => sum + review.star, 0) /
            tour.reviews.length
          : 0,
      reviewCount: tour.reviews.length,
    }));
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in fetching tours by agent action: ${error.message}`
        : `unknown error in fetching tours by agent action`;
    throw new Error(errorMsg);
  }
};
