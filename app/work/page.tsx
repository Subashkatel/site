import type { Metadata } from 'next';
import { Row } from '../components/Row';

export const metadata: Metadata = {
  title: 'Work',
  alternates: { canonical: '/work' },
};

const researchTopics = [
  {
    name: 'Decoder hierarchies',
    description:
      'Most errors on a quantum computer are routine, and a few are weird. Classical computers handle this sort of thing by putting something small and quick in front of something big and slow. I’m curious what that looks like for decoders.',
  },
  {
    name: 'Heterogeneous error correction',
    description:
      'Some codes are good at remembering, others at computing. Using each for its strength looks great on paper. Whether it still looks great once decoding enters the picture is the fun part.',
  },
  {
    name: 'Full-stack simulation',
    description:
      'All of this is easier to answer if you can watch the quantum and classical halves run together. They’re usually studied apart. I like building tools that put them back in the same room.',
  },
];

export default function WorkPage() {
  return (
    <>
      <Row rail="research" className="section">
        {researchTopics.map((topic) => (
          <div className="topic" key={topic.name}>
            <span className="topic-name">{topic.name}</span>
            <p>{topic.description}</p>
          </div>
        ))}
      </Row>

      <Row rail="previously" className="section">
        <p className="lede">
          At UC San Diego I worked on compilers with Hadi Esmaeilzadeh, sustainable computing with
          Ryan Kastner, and machine learning for particle physics with Javier Duarte. At Harvard,
          with Vijay Janapa Reddi, I looked at how you judge hardware that an AI designed.
        </p>
      </Row>
    </>
  );
}
