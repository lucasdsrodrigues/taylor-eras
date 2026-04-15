import React from "react";
import "./quote.css";

function Quote() {
  return (
    <section className="quote-section">
      <blockquote>
        <p>
          “Each era tells a story.<br />
          Together, they tell a lifetime.”
        </p>
        <span>— Taylor Swift</span>
      </blockquote>
    </section>
  );
}

export default Quote;