import React, { useState } from 'react';

function Assistant() {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    open: false,
    link: '',
    image: '',
    file: '',
    category: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('http://localhost:1000/postassistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({
          question: '',
          answer: '',
          open: false,
          link: '',
          image: '',
          file: '',
          category: ''
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assistant Data Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium" htmlFor="question">Question<span className="text-red-500">*</span></label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="answer">Answer<span className="text-red-500">*</span></label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center">
          <input
            className="mr-2"
            type="checkbox"
            id="open"
            name="open"
            checked={formData.open}
            onChange={handleChange}
          />
          <label htmlFor="open" className="font-medium">Open Link in New Tab</label>
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="link">Link</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="image">Image URL</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="file">File URL</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            id="file"
            name="file"
            value={formData.file}
            onChange={handleChange}
            placeholder="https://example.com/file.pdf"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="category">Category</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. General, Help, etc."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Submit'}
        </button>
        {status === 'success' && (
          <div className="text-green-600 mt-2">Form submitted successfully!</div>
        )}
        {status === 'error' && (
          <div className="text-red-600 mt-2">There was an error submitting the form.</div>
        )}
      </form>
    </div>
  );
}

export default Assistant;