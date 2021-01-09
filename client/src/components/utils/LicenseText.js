import React from 'react';
import {Box, List, ListItem, Stack} from "@chakra-ui/react";

function LicenseText(props) {
    return (
        <Box fontSize="lg">
                This agreement (the “Agreement”) is for a <b>non-exclusive MP3 Lease</b>, effective as of <b>{props.date}</b> (the “Effective Date”).
                &nbsp;<b>Producer Name</b> p/k/a <b>{props.producer}</b> (the “Producer” or “Licensor”); and <b>Licensee</b> (“You” or “Licensee”),
            sets forth the terms and conditions of the Licensee’s use of the Producer’s music file(s) entitled <b>{props.title}</b> (the “Beat”)
            in consideration for the Licensee’s payment of <b>${props.price} USD</b> (the “License Fee”).

            <br></br>

            This Agreement is issued solely in connection with and for the Licensee's use of the Beat pursuant and subject to all terms and
            conditions set forth herein.

            <List as="ol" styleType="decimal" ml="2em" mt="1em">
                    <Stack>
                        <ListItem>
                            <b>License Fee:</b>
                            <br></br>
                    The Licensee shall pay the full amount of the License Fee to the Producer on the date of this Agreement.
                    This Agreement is not valid until the License Fee has been paid in full to the Producer.
                    </ListItem>
                        <ListItem>
                            <b>Electronic delivery of the Beat:</b>
                            <br></br>
                            <List as="ol" styleType="lower-alpha" ml="2em">
                                <ListItem>
                                    The Producer shall deliver the Beat as a high-quality MP3 file, as such terms are understood in the music industry.
                            </ListItem>
                                <ListItem>
                                    The Licensee shall receive a link to download the Beat after the License Fee has been paid to the Producer.
                            </ListItem>
                                <ListItem>
                                    Should the Licensee not receive the link to download the Beat under any circumstances, it is the Licensee's responsibility
                                    to contact the Producer through e-mail to resolve any issues associated with delivery of the Beat.
                            </ListItem>
                            </List>
                        </ListItem>
                        <ListItem>
                            <b>Term:</b>
                            <br></br>
                    The Term of this Agreement shall be ten (10) years and this license shall expire on the ten (10) year anniversary of the
                    Effective Date.
                </ListItem>

                        <ListItem>
                            <b>Usage of the Beat:</b>
                            <br></br>
                            <List as="ol" styleType="lower-alpha" ml="2em">
                                <ListItem>
                                    In consideration for Licensee’s payment of the License Fee, the Producer grants the Licensee a <b>limited non-exclusive,
                                    nontransferable license</b> (the "License") and the right to use and modify the Beat in the preparation of <b>one (1)</b> new piece of
                                    music created by the Licensee (the "New Song").
                                </ListItem>
                                <ListItem>
                                    The New Song must include some form of creative input from the Licensee, including but not limited to vocals produced by the
                                    Licensee.
                                    As such, the Licensee does not have the right to sell the Beat in the form that it was delivered to Licensee, in other words, to "re-sell" the Beat to another party.
                                    Any sale of the Beat in its original form by Licensee is considered a breach of this Agreement and the Licensee is liable to pay to the Producer for damages.
                                </ListItem>
                                <ListItem>
                                    The Licensee has permission to use the Beat in its entirety or partly incorporate the Beat into the New Song.
                                </ListItem>
                                <ListItem>
                                    The Producer grants the Licensee a worldwide, non-exclusive license to use the Beat in preparation and incorpoation
                                    of the New Song.
                                    <List as="ul" styleType="disc" ml="2em">
                                        <ListItem>
                                            The New Song may be played on <b>zero (0)</b> terrestrial or satellite radio stations.
                                    </ListItem>
                                        <ListItem>
                                            The Licensee may use the New Song in synchronization with an audiovisual work in <b>one (1)</b> video (the "Video") of length no longer than ten (10) minutes.
                    If the New Song is longer than ten (10) minutes in length, the Video's length shall be limited to ten (10) minutes.
                    The Video may be used freely in the discretion of the Licensee, such uses include but are not limited to broadcasting on any television network,
                    digital streaming, and free downloads.
                    For the avoidance of doubt, the free usage of the Video does NOT imply free usage of the Beat and/or the New Song.
                    The Producer grants no other synchronization rights to the Licensee.
                    </ListItem>
                                        <ListItem>
                                            The Licensee may sell the New Song in physical and/or digital form, up to a total of <b>1000</b> downloads and/or physical music products.
                    </ListItem>
                                        <ListItem>
                                            The Licensee are allowed a total of <b>10000</b> streams on digital music streaming platforms including but not limited to Spotify, Apple Music, and/or Soundcloud.
                    </ListItem>
                                    </List>
                                </ListItem>
                            </List>
                        </ListItem>

                        <ListItem>
                            <b>Restrictions on the use of the Beat:</b>
                            <br></br>
                The Licensee hereby agrees to and acknowledges the listed activities, set forth below:
                <List as="ol" styleType="lower-alpha" ml="2em">
                                <ListItem>
                                    Any rights the Producer grants to the Licensee are <b>NON-TRANSFERABLE</b> and that the Licensee is prohibited from transferring or assigning any of its rights to any third-party;
                </ListItem>
                                <ListItem>
                                    The Licensee shall not synchronize, or permit any third parties to synchronize the Beat or New Song with any audiovisual works except for use in the Video as described in section "Usage of the Beat".
                </ListItem>
                                <ListItem>
                                    <b>THE LICENSEE SHALL NOT REGISTER THE BEAT AND/OR THE NEW SONG WITH ANY CONTENT IDENTIFICATION SYSTEM, SERVICE PROVIDER, MUSIC DISTRIBUTOR, RECORD LABEL OR DIGITAL AGGREGATOR</b>&nbsp;
                (for example TuneCore or CDBaby, and any other provider of user-generated content identification services). This restriction prevents the Licensee from receiving a copyright infringement
                takedown notice from a third party who also received a non-exclusive license to use the Beat in a New Song.
                In the event the Licensee does not adhere to the aforementioned policy, the Licensee acknowledges its License to use the Beat and/or New Song may be revoked without notice or compensation to the Licensee.
                For the avoidance of doubt, the Licensee is permitted to sell and upload the New Song on any music services under the terms described in section "Usage of the Beat".
                </ListItem>
                                <ListItem>
                                    As applicable to both the underlying composition in the Beat and to the master recording of the Beat:
                <List as="ol" styleType="lower-roman" ml="2em">
                                        <ListItem>
                                            As applicable to the Beat and/or the New Song, there is no intention by the parties to create a joint work; and
                                        </ListItem>
                                        <ListItem>
                                            There is no intention by the Producer to grant any rights in and/or to any other derivative works that may have been created by other third-party licensees.
                                        </ListItem>
                                    </List>
                                </ListItem>
                            </List>
                        </ListItem>
                        <ListItem>
                            <b>Ownership:</b>
                            <br></br>
                            <List as="ol" styleType="lower-alpha" ml="2em">
                                <ListItem>
                                    The Producer is and shall remain the sole owner and holder of all rights, title, and interest in the Beat, including all copyrights to and in the sound recording and the underlying musical compositions written
                                    and composed by the Producer. Nothing contained herein shall constitute an assignment by the Producer to the Licensee of any of the foregoing rights.
                                </ListItem>
                                <ListItem>
                                    The Licensee shall not register or attempt to register the New Song and/or the Beat with the U.S. Copyright Office.
                                    The right to register the New Song and/or the Beat with the U.S. Copyright Office shall be strictly limited to the Producer.
                                </ListItem>
                                <ListItem>
                                    The Licensee will, upon request, execute, acknowledge and deliver to Producer such additional documents as the Producer may deem necessary to evidence and effectuate the Producer’s rights hereunder,
                                    and the Licensee hereby grants to the Producer the right as attorney-in-fact to execute, acknowledge, deliver and record in the U.S. Copyright Office or elsewhere any and all such documents if
                                    the Licensee shall fail to execute same within five (5) days after so requested by the Producer.
                                </ListItem>
                                <ListItem>
                                    For the avoidance of doubt, the Licensee do not own the master or the sound recording rights in the New Song.
                                    The Licensee have been licensed the right to use the Beat in the New Song and to commercially exploit the New Song based on the terms and conditions of this Agreement.
                                </ListItem>
                                <ListItem>
                                    Notwithstanding the above, the Licensee owns the lyrics or other original musical components of the New Song that were written or composed solely by the Licensee.
                                </ListItem>
                                <ListItem>
                                    With respect to the publishing rights and ownership of the underlying composition embodied in the New Song, the Licensee, and the Producer hereby acknowledge and agree that
                                    the underlying composition shall be owned/split between them as follows:
                                </ListItem>
                                <List as="ul" styleType="disc" ml="2em">
                                    <ListItem>
                                        <b>Licensee</b>, owns 50% of the writers share.
                                    </ListItem>
                                    <ListItem>
                                        <b>Producer Name</b> p/k/a <b>{props.producer}</b>, owns 50% of the writers share.
                                    <List as="ul" styleType="circle" ml="2em">
                                            <ListItem>
                                                The Producer shall own, control, and administer One Hundred Percent (100%) of the so-called “Publisher’s Share” of the underlying composition.
                                                In the event that the Licensee wishes to register his/her interests and rights to the underlying composition of the New Song with their Performing Rights Organization (“PRO”),
                                                the Licensee must simultaneously identify and register the Producer’s share and ownership interest in the composition to indicate that Producer wrote and owns 50% of the composition in the
                                                New Song and as the owner of 100% of the Publisher’s share of the New Song.
                                            </ListItem>
                                        </List>
                                    </ListItem>
                                </List>
                                <ListItem>
                                    The licensee shall be deemed to have signed, affirmed and ratified its acceptance of the terms of this Agreement by virtue of its payment of the License Fee to the Producer and its electronic acceptance
                                    of its terms and conditions at the time the Licensee made payment of the License Fee.
                                </ListItem>
                            </List>
                        </ListItem>
                        <ListItem>
                            <b>Mechanical License:</b>
                            <br></br>
                            If any selection or musical composition, or any portion thereof, recorded in the New Song hereunder is written or composed by Producer, in whole or in part,
                            alone or in collaboration with others, or is owned or controlled, in whole or in part, directly or indirectly, by Producer or any person, firm, or corporation
                            in which Producer has a direct or indirect interest, then such selection and/or musical composition shall be hereinafter referred to as a “Controlled Composition”.
                            Producer hereby agrees to issue or cause to be issued, as applicable, to Licensee, mechanical licenses in respect of each Controlled Composition, which are embodied on the New Song.
                            For that license, on the United States and Canada sales, Licensee will pay mechanical royalties at one hundred percent (100%) of the minimum statutory rate, subject to no cap of that rate for albums and/or EPs.
                            For license outside the United States and Canada, the mechanical royalty rate will be the rate prevailing on an industry-wide basis in the country concerned on the date that this agreement has been entered into.
                            </ListItem>
                        <ListItem>
                            <b>Credit:</b>
                            <br></br>
                            Licensee shall have the right to use and permit others to use Producer’s approved name, approved likeness, and other approved identification and approved biographical material concerning the Producer solely for purposes of trade and otherwise without restriction solely in connection with the New Song recorded hereunder. Licensee shall use best efforts to have Producer credited as a “producer” and shall give Producer appropriate production and songwriting credit on all compact discs, record, music video, and digital labels or any other record configuration manufactured which is now known or created in the future that embodies the New Song created hereunder and on all cover liner notes, any records containing the New Song and on the front and/or back cover of any album listing the New Song and other musician credits. The licensee shall use its best efforts to ensure that Producer is properly credited and Licensee shall check all proofs for the accuracy of credits, and shall use its best efforts to cure any mistakes regarding Producer's credit. In the event of any failure by Licensee to issue the credit to Producer, Licensee must use reasonable efforts to correct any such failure immediately and on a prospective basis. Such credit shall be in the substantial form: “Produced by {props.producer}”.
                        </ListItem>
                        <ListItem>
                            <b>Licensor’s Option:</b>
                            <br></br>
                            Licensor shall have the option, at Licensor’s sole discretion, to terminate this License at any time within three (3) years of the date of this Agreement upon written notice to Licensee. In the event that Licensor exercises this option, Licensor shall pay to Licensee a sum equal to Two Hundred Percent (200%) of the License Fee paid by Licensee. Upon Licensor’s exercise of the option, Licensee must immediately remove the New Song from any and all digital and physical distribution channels and must immediately cease access to any streams and/or downloads of the New Song by the general public.
                </ListItem>
                        <ListItem>
                            <b>Breach by Licensee:</b>
                            <br></br>
                            <List as="ol" styleType="lower-alpha" ml="2em">
                                <ListItem>
                                    The licensee shall have five (5) business days from its receipt of written notice by Producer and/or Producer’s authorized representative to
                                    cure any alleged breach of this Agreement by Licensee. Licensee’s failure to cure the alleged breach within five (5) business days shall result
                                    in Licensee’s default of its obligations, its breach of this Agreement, and at Producer's sole discretion, the termination of Licensee’s rights hereunder.
                                </ListItem>
                                <ListItem>
                                    If Licensee engages in the commercial exploitation and/or sale of the Beat or New Song outside of the manner and amount expressly provided for in this
                                    Agreement, Licensee shall be liable to Producer for monetary damages in an amount equal to any and all monies paid, collected by, or received by Licensee,
                                    or any third party on its behalf, in connection with such unauthorized commercial exploitation of the Beat and/or New Song.
                                </ListItem>
                                <ListItem>
                                    Licensee recognizes and agrees that a breach or threatened breach of this Agreement by Licensee give rise to irreparable injury to Producer, which
                                    may not be adequately compensated by damages. Accordingly, in the event of a breach or threatened breach by the Licensee of the provisions of this
                                    Agreement, Producer may seek and shall be entitled to a temporary restraining order and a preliminary injunction restraining the Licensee from violating
                                    the provisions of this Agreement. Nothing herein shall prohibit Producer from pursuing any other available legal or equitable remedy from such breach or
                                    threatened breach, including but not limited to the recovery of damages from the Licensee. The Licensee shall be responsible for all costs, expenses or
                                    damages that Producer incurs as a result of any violation by the Licensee of any provision of this Agreement. Licensee’ obligation shall include court
                                    costs, litigation expenses, and reasonable attorneys' fees.
                                </ListItem>
                            </List>
                        </ListItem>
                        <ListItem>
                            <b>Warranties, Representations, and Indemnification:</b>
                            <br></br>
                            <List as="ol" styleType="lower-alpha" ml="2em">
                                <ListItem>
                                    Licensee hereby agrees that Licensor has not made any guarantees or promises that the Beat fits the particular creative use or musical purpose
                                    intended or desired by the Licensee. The Beat, its sound recording, and the underlying musical composition embodied therein are licensed to the
                                    Licensee “as is” without warranties of any kind or fitness for a particular purpose.
                            </ListItem>
                                <ListItem>
                                    Producer warrants and represents that he has the full right and ability to enter into this agreement, and is not under any disability, restriction, or prohibition
                                    with respect to the grant of rights hereunder. Producer warrants that the manufacture, sale, distribution, or other exploitation of the New Song hereunder will
                                    not infringe upon or violate any common law or statutory right of any person, firm, or corporation; including, without limitation, contractual rights, copyrights, and
                                    right(s) of privacy and publicity and will not constitute libel and/or slander. Licensee warrants that the manufacture, sale, distribution, or other exploitation
                                    of the New Song hereunder will not infringe upon or violate any common law or statutory right of any person, firm, or corporation; including, without limitation,
                                    contractual rights, copyrights, and right(s) of privacy and publicity and will not constitute libel and/or slander. The foregoing notwithstanding, Producer undertakes
                                    no responsibility whatsoever as to any elements added to the New Song by Licensee, and Licensee indemnifies and holds Producer harmless for any such elements.
                                    Producer warrants that he did not “sample” (as that term is commonly understood in the recording industry) any copyrighted material or sound recordings belonging
                                    to any other person, firm, or corporation (hereinafter referred to as “Owner”) without first having notified Licensee. The licensee shall have no obligation to
                                    approve the use of any sample thereof; however, if approved, any payment in connection therewith, including any associated legal clearance costs, shall be borne
                                    by Licensee. Knowledge by Licensee that “samples” were used by Producer which was not affirmatively disclosed by Producer to Licensee shall shift, in whole or in part,
                                    the liability for infringement or violation of the rights of any third party arising from the use of any such “sample” from Producer to Licensee.
                            </ListItem>
                                <ListItem>
                                    Parties hereto shall indemnify and hold each other harmless from any and all third party claims, liabilities, costs, losses, damages or expenses as are actually
                                    incurred by the non-defaulting party and shall hold the non-defaulting party, free, safe, and harmless against and from any and all claims, suits, demands, costs,
                                    liabilities, loss, damages, judgments, recoveries, costs, and expenses; (including, without limitation, reasonable attorneys' fees), which may be made or brought,
                                    paid, or incurred by reason of any breach or claim of breach of the warranties and representations hereunder by the defaulting party, their agents, heirs, successors,
                                    assigns and employees, which have been reduced to final judgment; provided that prior to final judgment, arising out of any breach of any representations or warranties
                                    of the defaulting party contained in this agreement or any failure by defaulting party to perform any obligations on its part to be performed hereunder the non-defaulting
                                    party has given the defaulting party prompt written notice of all claims and the right to participate in the defense with counsel of its choice at its sole expense.
                                    In no event shall Artist be entitled to seek injunctive or any other equitable relief for any breach or non-compliance with any provision of this agreement.
                            </ListItem>
                            </List>
                        </ListItem>
                        <ListItem>
                            <b>Miscellaneous:</b>
                            <br></br>
                            This Agreement constitutes the entire understanding of the parties and is intended as a final expression of their agreement and cannot be altered, modified, amended or waived, in whole or in part, except by written instrument (email being sufficient) signed by both parties hereto. This agreement supersedes all prior agreements between the parties, whether oral or written. Should any provision of this agreement be held to be void, invalid or inoperative, such decision shall not affect any other provision hereof, and the remainder of this agreement shall be effective as though such void, invalid or inoperative provision had not been contained herein. No failure by Licensor hereto to perform any of its obligations hereunder shall be deemed a material breach of this agreement until the Licensee gives Licensor written notice of its failure to perform, and such failure has not been corrected within thirty (30) days from and after the service of such notice, or, if such breach is not reasonably capable of being cured within such thirty (30) day period, Licensor does not commence to cure such breach within said time period, and proceed with reasonable diligence to complete the curing of such breach thereafter. This agreement shall be governed by and interpreted in accordance with the laws of Canada applicable to agreements entered into and wholly performed in said State, without regard to any conflict of laws principles. You hereby agree that the exclusive jurisdiction and venue for any action, suit or proceeding based upon any matter, claim or controversy arising hereunder or relating hereto shall be in the state or federal courts located in Canada. You shall not be entitled to any monies in connection with the Master(s) other than as specifically set forth herein. All notices pursuant to this agreement shall be in writing and shall be given by registered or certified mail, return receipt requested (prepaid) at the respective addresses hereinabove set forth or such other address or addresses as may be designated by either party. Such notices shall be deemed given when received. Any notice mailed will be deemed to have been received five (5) business days after it is mailed; any notice dispatched by expedited delivery service will be deemed to be received two (2) business days after it is dispatched. YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE READ THIS AGREEMENT AND HAVE BEEN ADVISED BY US OF THE SIGNIFICANT IMPORTANCE OF RETAINING AN INDEPENDENT ATTORNEY OF YOUR CHOICE TO REVIEW THIS AGREEMENT ON YOUR BEHALF. YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE HAD THE UNRESTRICTED OPPORTUNITY TO BE REPRESENTED BY AN INDEPENDENT ATTORNEY. IN THE EVENT OF YOUR FAILURE TO OBTAIN AN INDEPENDENT ATTORNEY OR WAIVER THEREOF, YOU HEREBY WARRANT AND REPRESENT THAT YOU WILL NOT ATTEMPT TO USE SUCH FAILURE AND/OR WAIVER as a basis to avoid any obligations under this agreement, or to invalidate this agreement or To render this agreement or any part thereof unenforceable. This agreement may be executed in counterparts, each of which shall be deemed an original, and said counterparts shall constitute one and the same instrument. In addition, a signed copy of this agreement transmitted by facsimile or scanned into an image file and transmitted via email shall, for all purposes, be treated as if it was delivered containing an original manual signature of the party whose signature appears thereon and shall be binding upon such party as though an originally signed document had been delivered. Notwithstanding the foregoing, in the event that you do not sign this Agreement, your acknowledgment that you have reviewed the terms and conditions of this Agreement and your payment of the License Fee shall serve as your signature and acceptance of the terms and conditions of this Agreement.
                </ListItem>
                    </Stack>
                </List>
        </Box>
    );
};

export default LicenseText;
