import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ExploreKenya = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2024/05/27/213837_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center px-6 text-white max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Journey Through the Soul of Kenya
            </h1>
            <p className="text-xl md:text-2xl">
              From ancient landscapes to bustling modern cities, uncover the essence of a nation rooted in tradition, adventure, and vibrant community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Storytelling Chapters */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="space-y-24">
          {/* Chapter 1: Origins */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <img
              src="https://cdn.pixabay.com/photo/2022/08/10/17/54/mount-kenya-7377780_1280.jpg"
              alt="Great Rift Valley"
              className="rounded-2xl shadow-lg object-cover h-96 w-full"
            />
            <div>
              <h2 className="text-3xl font-semibold mb-4">Where Earth Split & Life Began</h2>
              <p className="text-lg text-gray-600">
                Kenya is home to the Great Rift Valley, where humanity first stood tall. It's a place of ancient energy, from volcanic highlands to deep freshwater lakes where flamingos dance.
              </p>
            </div>
          </motion.div>

          {/* Chapter 2: Rhythm of the People */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="md:order-2">
              <img
                src="https://kenya.gibf.biz/img/india-kenya-business-and-cultural-council-culture-of-kenya-clothing.jpg"
                alt="Kenyan culture"
                className="rounded-2xl shadow-lg object-cover h-96 w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-4">Voices, Colors & Celebration</h2>
              <p className="text-lg text-gray-600">
                Across its 40+ tribes, Kenya is a mosaic of song, fashion, dance, and ancestral wisdom. From the rhythms of the Luo drums to Maasai chants echoing in the hills, culture here isn’t just seen — it’s felt.
              </p>
            </div>
          </motion.div>

          {/* Chapter 3: Wild Kingdoms */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <img
              src="https://media.istockphoto.com/id/2160294463/photo/elephants-at-amboseli.jpg?s=1024x1024&w=is&k=20&c=mfcVVKuovKuL6p5p5KR4L3qkCVoxb3o510akh67CYVM="
              alt="Safari in Kenya"
              className="rounded-2xl shadow-lg object-cover h-96 w-full"
            />
            <div>
              <h2 className="text-3xl font-semibold mb-4">The Wild Still Roams</h2>
              <p className="text-lg text-gray-600">
                From the majestic lions of Maasai Mara to the elephants of Amboseli beneath Kilimanjaro’s gaze — Kenya invites you into nature’s theatre, where survival plays out on a grand savannah stage.
              </p>
            </div>
          </motion.div>

          {/* Chapter 4: Coastal Poetry */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="md:order-2">
              <img
                src="https://media.istockphoto.com/id/1454842745/photo/tourism.jpg?s=1024x1024&w=is&k=20&c=BNjHc6s8vfj2Ikp7IkCgbQxIgx129376UltSJ8gicO0="
                alt="Diani Beach"
                className="rounded-2xl shadow-lg object-cover h-96 w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-4">Swahili Sands & Ocean Breeze</h2>
              <p className="text-lg text-gray-600">
                Kenya’s coast whispers old Arabic tales, with white-sand beaches, coral reefs, and historic towns like Lamu — where dhows drift by and every sunset feels like a prayer.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-emerald-600 text-white text-center py-20">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-4">Begin Your Kenyan Chapter</h2>
          <p className="text-lg mb-6">
            The story of Kenya is waiting. Let it unfold around you — in color, in sound, in soul.
          </p>
          <Link
            to="/services"
            className="bg-white text-emerald-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Explore Services
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default ExploreKenya;
