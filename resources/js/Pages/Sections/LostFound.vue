<template>
    <div class="box-page">
        <div class="card-header">
            <span class="card-header-icon">
                <img src="/images/exchange.svg" />
            </span>
            <h1 class="card-header-text">Lost and Found</h1>
        </div>

        <p>&nbsp;</p>
        <div class="box-content">

            <h2 class="text-2xl font-bold mb-2">Find a disc? Lose a disc?</h2>
            <p>
                Please put found discs in the disc drop by the tees for holes 2/11. Our volunteers will reach out to
                the number on the disc.
            </p>
            <img src="/images/disc_drop.jpeg" class="w-full block rounded-lg my-4" alt="Disc drop box" />

            <div class="faq">

                <div class="faq-item">
                    <h3>How do I get my disc back?</h3>
                    <p>The lost and found is in the lockbox by the tees for holes 2/11.</p>
                    <p>
                        <strong>Summer:</strong> Monday afternoons before our doubles event will be your best bet.
                        On other days, there is often someone who can open the lost and found a few hours before sundown.
                        Ask around, especially at the picnic table by tee #2.
                    </p>
                    <p>
                        <strong>Winter:</strong> You might still be able to find someone at the course, but shorter days
                        mean less golf for all of us. Best to reach out if you're unable to find someone.
                    </p>
                    <p>
                        Contact: Email us at
                        <a href="mailto:info@mineralspringsdgc.com" class="text-blue-600 underline">info@mineralspringsdgc.com</a>
                        or jump on our
                        <a href="https://www.facebook.com/groups/msdgc" target="_blank" rel="noopener" class="text-blue-600 underline">Facebook group</a>!
                    </p>
                </div>

                <div class="faq-item">
                    <h3>How long do you hang on to my disc?</h3>
                    <p>We keep it for at least two months and turn them over as we run out of storage space.</p>
                    <p>
                        Unclaimed discs are sold as a fundraiser for the club. Funds help with course maintenance,
                        equipment, and other expenses. If your disc is in the for-sale bin, you can still claim it.
                        But once it's sold, it's gone.
                    </p>
                </div>

                <div class="faq-item">
                    <h3>What if my disc has no number, a land-line, or my email?</h3>
                    <p>We only text <em>legible</em> cell phone numbers on the disc. There is a spot in the lost and found for no-number discs.</p>
                </div>

                <div class="faq-item">
                    <h3>Is this a perfect system?</h3>
                    <p>
                        This is run by volunteers. Please cut the slackers some slack if communication isn't the best,
                        we can't be available the moment you need us, or whatever else might go wrong.
                    </p>
                    <p>The lost and found runs on the honor system. We don't check IDs on people claiming discs.</p>
                </div>

                <div class="faq-item">
                    <h3>What if I don't need the disc back?</h3>
                    <p>
                        If you aren't able to come pick it up or the disc isn't worth the hassle, please let us know.
                        We'll sell it as a club fundraiser.
                    </p>
                </div>

                <div class="faq-item">
                    <h3>What if I need more time — can you hang on to it?</h3>
                    <p>
                        Your best bet is if someone local can grab it for you, but we will do our best to work with you.
                        Start by responding to the text you got and let them know when you think you can get it.
                        You can also email us at
                        <a href="mailto:info@mineralspringsdgc.com" class="text-blue-600 underline">info@mineralspringsdgc.com</a>
                        or reach out on our
                        <a href="https://www.facebook.com/groups/msdgc" target="_blank" rel="noopener" class="text-blue-600 underline">Facebook group</a>.
                        We can't promise to store your disc forever, but we'll try to work with you.
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.faq {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.faq-item {
    border-left: 3px solid #3b82f6;
    padding-left: 1rem;
}

.faq-item h3 {
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
    color: #1e3a5f;
}

.faq-item p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

p:hover {
    color: inherit;
    transition: none;
}
</style>
